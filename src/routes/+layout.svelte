<script lang="ts">
  import '../app.css';
  import { Moon, Sun, Home } from 'lucide-svelte';
  import { playgroundStore } from '../lib/components/stores/playground.svelte';
  import { ThemeProvider } from '@stylist-svelte';
  import type { ThemeName } from '@stylist-svelte/design-system/themes';
  import { page } from '$app/stores';
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();

  // Initialize playground store IMMEDIATELY (synchronously) before first render
  // This ensures dark mode class is applied before any component renders
  if (typeof window !== 'undefined') {
    playgroundStore.init();
  }

  // Reactive state from the centralized store
  let darkMode = $derived(playgroundStore.state.darkMode);
  let componentTreeOpen = $derived(playgroundStore.uiState.componentTreeOpen);

  // Check if on playground page
  let isPlaygroundPage = $derived($page.url.pathname.startsWith('/playground'));

  // Sync theme with playground dark mode
  let currentTheme: ThemeName = $derived(darkMode ? 'dark' : 'light');

</script>

<ThemeProvider initialTheme={currentTheme}>
<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <!-- Simple top nav (hidden on playground pages) -->
  {#if !isPlaygroundPage}
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
    <div class="{isPlaygroundPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}">
      <div class="flex items-center justify-between h-14">
        <div class="flex items-center gap-3">
          <!-- Logo in top-left corner (always links to home) -->
          <a href="/" class="flex items-center pl-3 group">
            <img src="/stylist.png" alt="Stylist logo" class="w-10 h-10" loading="lazy" decoding="async" />
          </a>

          {#if isPlaygroundPage}
            <!-- STYLIST text as toggle button (only on playground pages) -->
            <button
              onclick={() => playgroundStore.toggleComponentTree()}
              class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 {componentTreeOpen
                ? 'bg-[var(--playground-accent-surface)] dark:bg-[var(--playground-accent-surface-strong)] ring-2 ring-[var(--playground-accent)] shadow-[0_15px_30px_var(--playground-accent-shadow)]'
                : 'hover:bg-[var(--playground-accent-surface)] dark:hover:bg-[var(--playground-accent-surface-strong)]'}"
            >
              <span class="text-xl font-black tracking-tight {componentTreeOpen ? 'text-[var(--playground-accent)]' : 'text-gray-900 dark:text-white'}">
                STYLIST
              </span>
            </button>
          {:else}
            <!-- Regular STYLIST text (non-playground pages) -->
            <span class="text-xl font-black tracking-tight text-gray-900 dark:text-white pl-3">
              STYLIST
            </span>
          {/if}

          <div class="h-6 border-l border-gray-300 dark:border-gray-600"></div>

          {#if !isPlaygroundPage}
            <a href="/playground" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--playground-accent)] dark:hover:text-[var(--playground-accent)] transition-colors">
              Playground
            </a>
          {/if}
        </div>

        <div class="flex items-center gap-4">
          <a
            href="/components"
            class="text-sm font-medium transition-colors {$page.url.pathname === '/components' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}"
          >
            Components
          </a>

          <div class="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
            <a
              href="https://svelte.dev"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Svelte"
              title="Built with Svelte"
            >
              <svg class="w-5 h-5" viewBox="0 0 98.1 118" fill="none">
                <path d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 15.7 32.6 20.3 48.2 10.4l27.5-17.5c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.5" fill="#FF3E00"/>
                <path d="M40.9 103.9c-8.9 2.3-18.2-1.2-23.4-8.7-3.2-4.4-4.4-9.9-3.5-15.3.2-.9.4-1.7.6-2.6l.5-1.6 1.4 1c3.3 2.4 6.9 4.2 10.8 5.4l1 .3-.1 1c-.1 1.4.3 2.9 1.1 4.1 1.6 2.3 4.4 3.4 7.1 2.7.6-.2 1.2-.4 1.7-.7L65.5 72c1.4-.9 2.3-2.2 2.6-3.8.3-1.6-.1-3.3-1-4.6-1.6-2.3-4.4-3.3-7.1-2.6-.6.2-1.2.4-1.7.7l-10.5 6.7c-1.7 1.1-3.6 1.9-5.6 2.4-8.9 2.3-18.2-1.2-23.4-8.7-3.1-4.4-4.4-9.9-3.4-15.3.9-5.2 4.1-9.9 8.6-12.7l27.5-17.5c1.7-1.1 3.6-1.9 5.6-2.5 8.9-2.3 18.2 1.2 23.4 8.7 3.2 4.4 4.4 9.9 3.5 15.3-.2.9-.4 1.7-.7 2.6l-.5 1.6-1.4-1c-3.3-2.4-6.9-4.2-10.8-5.4l-1-.3.1-1c.1-1.4-.3-2.9-1.1-4.1-1.6-2.3-4.4-3.3-7.1-2.6-.6.2-1.2.4-1.7.7L32.4 46.1c-1.4.9-2.3 2.2-2.6 3.8s.1 3.3 1 4.6c1.6 2.3 4.4 3.3 7.1 2.6.6-.2 1.2-.4 1.7-.7l10.5-6.7c1.7-1.1 3.6-1.9 5.6-2.5 8.9-2.3 18.2 1.2 23.4 8.7 3.2 4.4 4.4 9.9 3.5 15.3-.9 5.2-4.1 9.9-8.6 12.7l-27.5 17.5c-1.7 1.1-3.6 1.9-5.6 2.5" fill="#FFF"/>
              </svg>
            </a>

            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Tailwind CSS"
              title="Styled with Tailwind CSS"
            >
              <svg class="w-5 h-5" viewBox="0 0 54 33" fill="none">
                <g clip-path="url(#prefix__clip0)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" fill="#06B6D4"/>
                </g>
              </svg>
            </a>

            <button
              onclick={() => playgroundStore.toggleDarkMode()}
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transitions" aria-label="Toggle dark mode"
            >
              {#if darkMode}
                <Sun class="w-5 h-5" />
              {:else}
                <Moon class="w-5 h-5" />
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  {/if}

  <!-- Main content -->
  <div class="{isPlaygroundPage ? '' : 'pt-14'}">
    {@render children()}
  </div>
</div>
</ThemeProvider>
