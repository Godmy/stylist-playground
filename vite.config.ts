import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// Cache for resolved paths to avoid repeated file system checks
const resolveCache = new Map<string, string | null>();

export default defineConfig({
	plugins: [
		tailwindcss(),
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
