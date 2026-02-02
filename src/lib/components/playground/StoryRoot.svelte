<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { playgroundStore } from '../stores/playground.svelte';
  import { registerShortcut, initKeyboardShortcuts, deinitKeyboardShortcuts, isInputElement, ShortcutHelpers } from '../utils/keyboard';
  import Navigator from './Navigator.svelte';
  import Canvas from './Canvas.svelte';
  import PlaygroundToolbar from './PlaygroundToolbar.svelte';
  import PlaygroundControlPanel from './PlaygroundControlPanel.svelte';
  import CodeViewer from './CodeViewer.svelte';

  type Props = {
    title?: string;
    children?: any;
  };

  let { title = 'Stylist Playground', children }: Props = $props();

  let state = $derived(playgroundStore.state);
  let darkMode = $derived(state.darkMode);
  let sidebarOpen = $derived(state.sidebarOpen);
  let showCode = $derived(state.showCode);
  let controlsOpen = $derived(state.controlsOpen);

  // Register keyboard shortcuts when component mounts
  onMount(() => {
    // Initialize keyboard shortcuts system
    initKeyboardShortcuts();

    // Register shortcuts
    registerShortcut(ShortcutHelpers.searchStories(() => {
      // For now, we'll just log this action
      // In a real implementation, this would open a search modal
      console.log('Search stories shortcut triggered');
    }));

    registerShortcut(ShortcutHelpers.toggleSidebar(() => {
      playgroundStore.toggleSidebar();
    }));

    registerShortcut(ShortcutHelpers.toggleDarkMode(() => {
      playgroundStore.toggleDarkMode();
    }));

    registerShortcut(ShortcutHelpers.showHelp(() => {
      // For now, we'll just log this action
      // In a real implementation, this would show a help modal
      console.log('Show help shortcut triggered');
    }));

    registerShortcut(ShortcutHelpers.closeModal(() => {
      // If code viewer is open, close it
      if (showCode) {
        playgroundStore.toggleCode();
      } else if (controlsOpen) {
        playgroundStore.toggleControls();
      }
    }));

    // Register custom shortcut for toggling code
    registerShortcut({
      key: 'u',
      ctrl: true,
      meta: true,
      description: 'Toggle code viewer',
      action: () => playgroundStore.toggleCode()
    });
  });

  // Clean up when component unmounts
  onDestroy(() => {
    deinitKeyboardShortcuts();
  });
</script>

<div class="w-full h-screen bg-gray-50 text-gray-900 transition-colors {darkMode ? 'dark bg-gray-900 text-gray-100' : ''}">
  <div class="flex flex-col h-full">
    <!-- Header / Toolbar -->
    <header class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 {darkMode ? 'bg-gray-800 border-gray-700' : ''}">
      <div class="flex items-center gap-3">
        <button
          class="p-2 rounded-md hover:bg-gray-100 transition-colors {darkMode ? 'hover:bg-gray-700' : ''}"
          onclick={() => playgroundStore.toggleSidebar()}
          aria-label="Toggle sidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">{title}</h1>
      </div>

      <PlaygroundToolbar />
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar / Navigator -->
      {#if sidebarOpen}
        <aside class="w-64 bg-white border-r border-gray-200 overflow-y-auto {darkMode ? 'bg-gray-800 border-gray-700' : ''}">
          <Navigator />
        </aside>
      {/if}

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Canvas -->
        <div class="flex-1 overflow-auto">
          <Canvas>
            {#if children}
              {@render children()}
            {/if}
          </Canvas>
        </div>

        <!-- Bottom Panel: Code or Controls -->
        <div class="border-t border-gray-200 {darkMode ? 'border-gray-700' : ''}">
          {#if showCode}
            <CodeViewer />
          {/if}

          {#if controlsOpen && !showCode}
            <PlaygroundControlPanel />
          {/if}
        </div>
      </main>
    </div>
  </div>
</div>
