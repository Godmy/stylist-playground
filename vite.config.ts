import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

const LOG_DIR = path.resolve(__dirname, 'logs/dev-errors');

function ensureLogDir() {
	if (!fs.existsSync(LOG_DIR)) {
		fs.mkdirSync(LOG_DIR, { recursive: true });
	}
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

		if (!sessionFile) {
			const sessionStamp = timestamp.replace(/[:.]/g, '-');
			sessionFile = path.join(LOG_DIR, `session-${sessionStamp}.log`);
			fs.writeFileSync(
				sessionFile,
				`Stylist Playground dev session started at ${timestamp}\nLogs directory: ${LOG_DIR}\n`,
				'utf-8'
			);
		}

		const fileSlug = extractFileIdentifier(message);
		const messageSlug = sanitizeSegment(message.split('\n')[0] ?? 'error');
		const filename = `${timestamp.replace(/[:.]/g, '-')}__${fileSlug}__${messageSlug}.log`;
		const entry = `[${timestamp}] ${message}\n${stack ?? ''}\n`;
		fs.writeFileSync(path.join(LOG_DIR, filename), entry, 'utf-8');
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

export default defineConfig({
	plugins: [
		tailwindcss(),
		createErrorLoggerPlugin(),
		{
			name: 'stylist-svelte-lib-resolver',
			enforce: 'pre',
			resolveId: {
				order: 'pre',
				handler(source, importer) {
					if (!importer) return null;

					const normalizedImporter = importer.replace(/\\/g, '/');

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
