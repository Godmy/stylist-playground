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
			// Локальный playground-код
			$lib: path.resolve(__dirname, './src/lib'),
			$playground: path.resolve(__dirname, './src/lib'),
			// Алиас на исходники библиотеки для hot reload
			$stylist: path.resolve(__dirname, '../stylist-svelte/src/lib'),
			'@stylist-svelte': path.resolve(__dirname, '../stylist-svelte/src/lib')
		}
	}
};

export default config;
