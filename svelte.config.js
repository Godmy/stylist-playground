import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			// Playground's own $lib
			$lib: path.resolve(__dirname, './src/lib'),
			// Alias for stylist-svelte components
			'@stylist-svelte': path.resolve(__dirname, '../stylist-svelte/src/lib'),
			// Lightweight playground store import
			'@stylist-svelte/playground': path.resolve(__dirname, '../stylist-svelte/src/lib/playground')
		}
	}
};

export default config;
