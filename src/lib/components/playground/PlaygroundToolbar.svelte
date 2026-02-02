<script lang="ts">
  import { Monitor, Tablet, Smartphone, Maximize, Grid, Moon, Sun, Sidebar, Download, Copy, Settings, ChevronRight, Home, ArrowLeft, Bot, Info } from 'lucide-svelte';
  import { playgroundStore } from '../stores/playground.svelte';
  import type { ViewportSize } from '../types';
  import { formatShortcut } from '../utils/keyboard';
  import ShareButton from './ShareButton.svelte';

  interface Props {
    componentName?: string;
    category?: string;
    subcategory?: string;
    onInfoClick?: () => void;
  }

  let { componentName = '', category = '', subcategory = '', onInfoClick }: Props = $props();

  // Reactive state from store
  let currentViewport = $derived(playgroundStore.state.viewport);
  let showGrid = $derived(playgroundStore.uiState.showGrid);
  let darkMode = $derived(playgroundStore.state.darkMode);

  // Get number of controls for current story
  const currentStory = $derived(playgroundStore.getCurrentStory());
  const controlsCount = $derived(currentStory?.controls?.length || 0);

  const viewportSizes: { size: ViewportSize; icon: any; label: string; width: string }[] = [
    { size: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
    { size: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
    { size: 'desktop', icon: Monitor, label: 'Desktop', width: '1440px' },
    { size: 'fullscreen', icon: Maximize, label: 'Full', width: '100%' }
  ];

  function handleViewportChange(size: ViewportSize) {
    console.log('Changing viewport to:', size);
    playgroundStore.setViewport(size);
    console.log('Current viewport:', playgroundStore.state.viewport);
  }

  function handleToggleGrid() {
    console.log('Toggling grid. Current:', playgroundStore.uiState.showGrid);
    playgroundStore.toggleGrid();
    console.log('After toggle:', playgroundStore.uiState.showGrid);
  }

  function handleToggleDarkMode() {
    console.log('Toggling dark mode. Current:', playgroundStore.state.darkMode);
    playgroundStore.toggleDarkMode();
    console.log('After toggle:', playgroundStore.state.darkMode);
  }

  function copyCode() {
    console.log('Copy code');
  }

  function downloadScreenshot() {
    console.log('Download screenshot');
  }
</script>

<div class="toolbar-container h-14 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-4 shadow-sm">
  <!-- Left: Logo & Component name -->
  <div class="flex items-center gap-3 flex-1 min-w-0">
    <a href="/" class="flex items-center gap-2 flex-shrink-0 group">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </div>
      <span class="text-lg font-bold text-gray-900 dark:text-white hidden md:block">STYLIST</span>
    </a>

    {#if componentName}
      <div class="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
      <div class="flex items-center gap-2 min-w-0">
        <h1 class="text-base font-semibold text-gray-900 dark:text-white truncate">{componentName}</h1>
        {#if category}
          <span class="px-2 py-0.5 text-[10px] font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
            {category}
          </span>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Center: Viewport controls (compact) -->
  <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
    {#each viewportSizes as { size, icon: Icon, label }}
      <button
        onclick={() => handleViewportChange(size)}
        class="p-2 rounded transition-colors {currentViewport === size ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'}"
        title={label}
      >
        <Icon class="w-4 h-4" />
      </button>
    {/each}
  </div>

  <!-- Right: Essential actions only -->
  <div class="flex items-center gap-1 flex-1 justify-end">
    <button
      onclick={() => playgroundStore.toggleSidebar()}
      class="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title="Toggle sidebar"
    >
      <Sidebar class="w-4 h-4" />
    </button>

    <button
      onclick={handleToggleGrid}
      class="p-2 rounded-lg transition-colors {showGrid ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}"
      title="Toggle grid"
    >
      <Grid class="w-4 h-4" />
    </button>

    <button
      onclick={handleToggleDarkMode}
      class="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title="Toggle dark mode"
    >
      {#if darkMode}
        <Sun class="w-4 h-4" />
      {:else}
        <Moon class="w-4 h-4" />
      {/if}
    </button>

    <ShareButton />
  </div>
</div>

<style>
  .toolbar-container {
    position: relative;
    z-index: 10;
  }

  .toolbar-container::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.4), rgba(239, 68, 68, 0.4), transparent);
  }

  :global(.dark) .toolbar-container::after {
    background: linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.3), rgba(248, 113, 113, 0.3), transparent);
  }
</style>
