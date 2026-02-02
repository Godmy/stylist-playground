import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { watchAndRun } from 'vite-plugin-watch-and-run';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const LOG_DIR = path.resolve(__dirname, 'logs/dev-errors');
const COMPONENT_LOG_ROOT = path.join(LOG_DIR, 'components');

function ensureDir(dirPath: string) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

function ensureLogDir() {
	ensureDir(LOG_DIR);
	ensureDir(COMPONENT_LOG_ROOT);
}

function sanitizeSegment(value: string, fallback = 'log') {
	const cleaned = value
		.replace(/[^a-zA-Z0-9._-]+/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 40);
	return cleaned || fallback;
}

function extractFileIdentifier(message: string) {
	const fileMatch =
		message.match(/([A-Za-z]:)?[\\/:][^\\s:'"]+\.(svelte|ts|js|tsx|jsx)/i) ||
		message.match(/([\\w.-]+\.(svelte|ts|js|tsx|jsx))/i);
	if (!fileMatch) {
		return 'general';
	}
	return sanitizeSegment(path.basename(fileMatch[0]).replace(/\./g, '-'), 'general');
}

function formatArgs(args: unknown[]) {
	return args
		.map((arg) => {
			if (typeof arg === 'string') return arg;
			if (arg instanceof Error) return arg.message;
			if (typeof arg === 'object') {
				try {
					return JSON.stringify(arg);
				} catch {
					return '[object]';
				}
			}
			return String(arg);
		})
		.join(' ')
		.trim();
}

function resolveComponentLogLocation(message: string, stack?: string) {
	const haystack = `${message}\n${stack ?? ''}`.replace(/\\/g, '/');
	const componentMatch = haystack.match(
		/stylist-svelte\/src\/lib\/components\/(atoms|molecules|organisms)\/([^\s:'"]+\.(svelte|ts|js|tsx|jsx))/i
	);

	if (componentMatch) {
		const [, group, filePath] = componentMatch;
		const baseName = path.basename(filePath);
		const slug = sanitizeSegment(baseName.replace(/\./g, '-'), 'component');
		return {
			targetDir: path.join(COMPONENT_LOG_ROOT, group.toLowerCase()),
			filename: `${slug}.log`
		};
	}

	const fallbackSlug = extractFileIdentifier(message);
	return {
		targetDir: COMPONENT_LOG_ROOT,
		filename: `${fallbackSlug}.log`
	};
}

function buildComponentLogBody(timestamp: string, message: string, stack?: string) {
	const cleanedMessage = message.trim() || 'Unknown error';
	const cleanedStack = stack?.trim() || '(no stack provided)';

	const entries = [
		{ label: 'message', content: cleanedMessage },
		{ label: 'stack', content: cleanedStack }
	];

	return entries
		.map(({ label, content }) => {
			const sha = crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
			return `[${timestamp}] ${label} | sha256=${sha}\n${content}`;
		})
		.join('\n---\n')
		.concat('\n');
}

function createErrorLoggerPlugin() {
	let sessionFile: string | null = null;
	let lastSignature = '';
	let lastLogged = 0;

	const persistError = (message: string, stack?: string) => {
		if (!message) return;
		const signature = `${message}\n${stack ?? ''}`;
		const now = Date.now();
		if (signature === lastSignature && now - lastLogged < 50) {
			return;
		}

		lastSignature = signature;
		lastLogged = now;

		ensureLogDir();
		const timestamp = new Date().toISOString();
		const { targetDir, filename } = resolveComponentLogLocation(message, stack);
		ensureDir(targetDir);

		if (!sessionFile) {
			const sessionStamp = timestamp.replace(/[:.]/g, '-');
			sessionFile = path.join(LOG_DIR, `session-${sessionStamp}.log`);
			fs.writeFileSync(
				sessionFile,
				`Stylist Playground dev session started at ${timestamp}\nLogs directory: ${LOG_DIR}\n`,
				'utf-8'
			);
		}

		const entry = `[${timestamp}] ${message}\n${stack ?? ''}\n`;
		const componentLogBody = buildComponentLogBody(timestamp, message, stack);
		fs.writeFileSync(path.join(targetDir, filename), componentLogBody, 'utf-8');
		fs.appendFileSync(sessionFile, `\n${entry}\n---\n`, 'utf-8');
	};

	return {
		name: 'stylist-dev-error-logger',
		apply: 'serve',
		configureServer(server) {
			ensureLogDir();
			const initialStamp = new Date().toISOString().replace(/[:.]/g, '-');
			sessionFile = path.join(LOG_DIR, `session-${initialStamp}.log`);
			fs.writeFileSync(
				sessionFile,
				`Stylist Playground dev server boot at ${new Date().toISOString()}\nLog root: ${LOG_DIR}\n`,
				'utf-8'
			);

			const originalError = server.config.logger.error.bind(server.config.logger);
			server.config.logger.error = (...args: unknown[]) => {
				const message = formatArgs(args);
				const stackSource = args.find((arg): arg is Error => arg instanceof Error);
				persistError(message, stackSource?.stack);
				return originalError(...args);
			};

			server.watcher.on('event', (event: any) => {
				if (event.code === 'ERROR' && event.error) {
					persistError(event.error.message || 'Vite watcher error', event.error.stack);
				}
			});
		}
	};
}

// Cache for resolved paths to avoid repeated file system checks
const resolveCache = new Map<string, string | null>();

// Clear cache on config reload
resolveCache.clear();

export default defineConfig({
	plugins: [
		tailwindcss(),
		watchAndRun([
			{
				watch: ['logs/dev-errors/**/*.log'],
				run: 'node scripts/process-logs.mjs',
				delay: 500,
				quiet: false
			}
		]),
		createErrorLoggerPlugin(),
		{
			name: 'stylist-svelte-lib-resolver',
			enforce: 'pre',
			resolveId: {
				order: 'pre',
				handler(source, importer) {
					if (!importer) return null;

					const normalizedImporter = importer.replace(/\\/g, '/');

					// Handle stylist-svelte/* imports from playground app
					if (source.startsWith('stylist-svelte/')) {
						const cacheKey = `${importer}:${source}`;
						if (resolveCache.has(cacheKey)) {
							return resolveCache.get(cacheKey);
						}

						const subpath = source.replace('stylist-svelte/', '');
						const basePath = path.resolve(__dirname, '../stylist-svelte/src/lib', subpath);

						// Check directory with index first, then individual files
						const candidates = [
							path.join(basePath, 'index.ts'),
							path.join(basePath, 'index.js'),
							basePath + '.ts',
							basePath + '.js',
							basePath + '.svelte'
						];

						for (const candidate of candidates) {
							try {
								if (fs.existsSync(candidate)) {
									resolveCache.set(cacheKey, candidate);
									return candidate;
								}
							} catch (e) {
								// Continue to next candidate
							}
						}

						resolveCache.set(cacheKey, null);
					}

					// Only handle imports from stylist-svelte package
					if (normalizedImporter.includes('/stylist-svelte/')) {
						if (source === '$lib' || source.startsWith('$lib/')) {
							// Check cache first
							const cacheKey = `${importer}:${source}`;
							if (resolveCache.has(cacheKey)) {
								return resolveCache.get(cacheKey);
							}

							const subpath = source === '$lib' ? '' : source.slice(5);
							const basePath = path.resolve(__dirname, '../stylist-svelte/src/lib', subpath);

							// Try different extensions synchronously
							const candidates = [
								basePath + '.ts',
								basePath + '.js',
								basePath + '.svelte',
								path.join(basePath, 'index.ts'),
								path.join(basePath, 'index.js')
							];

							for (const candidate of candidates) {
								try {
									if (fs.existsSync(candidate)) {
										resolveCache.set(cacheKey, candidate);
										return candidate;
									}
								} catch (e) {
									// Continue to next candidate
								}
							}

							resolveCache.set(cacheKey, null);
							return null;
						}
					}
					return null;
				}
			}
		},
		sveltekit()
	],
	server: {
		fs: {
			allow: ['..']
		}
	},
	optimizeDeps: {
		include: ['lucide-svelte', 'shiki']
	}
});
