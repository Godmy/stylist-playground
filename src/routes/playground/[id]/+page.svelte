<script lang="ts">
  import { onMount } from 'svelte';
  // Use the library playground components and store
  import {
    playgroundStore,
    PlaygroundToolbar,
    PlaygroundSidebar,
    BottomPanel,
    PlaygroundControlPanel,
    CodeViewer,
    GenericCodeViewer,
    Canvas
  } from '@stylist-svelte/playground';
  import { keyboardShortcuts } from '../../../lib/utils/keyboard-shortcuts';
  import { generateComponentCode } from '../../../lib/utils/code-generator';

  interface Props {
    data: {
      story: any;
    };
  }

  let { data }: Props = $props();

  // Example variants for the component
  const variants = $state([
    {
      name: 'Default',
      description: 'Default component state',
      props: {}
    },
    {
      name: 'With Props',
      description: 'Component with sample props',
      props: { disabled: false }
    }
  ]);

  // Generate code for current props
  const generatedCode = $derived.by(() => {
    return generateComponentCode({
      componentName: data.story.componentName,
      category: data.story.category,
      props: playgroundStore.controlValues, // Use controlValues instead of currentProps
      includeImport: true,
      includeScript: true
    });
  });

  onMount(() => {
    // Don't call init() here - it's called in +layout.svelte
    // Don't call setCurrentStory - let the Story component handle its own state

    // Register keyboard shortcuts
    keyboardShortcuts.register({
      key: '/',
      ctrl: true,
      description: 'Toggle sidebar',
      action: () => playgroundStore.toggleSidebar()
    });

    keyboardShortcuts.register({
      key: 'd',
      ctrl: true,
      description: 'Toggle dark mode',
      action: () => playgroundStore.toggleDarkMode()
    });

    keyboardShortcuts.register({
      key: 'b',
      ctrl: true,
      description: 'Toggle bottom panel',
      action: () => playgroundStore.toggleBottomPanel()
    });

    keyboardShortcuts.register({
      key: 'g',
      ctrl: true,
      description: 'Toggle grid',
      action: () => playgroundStore.toggleGrid()
    });

    return () => {
      // Cleanup
      keyboardShortcuts.clear();
    };
  });

  function handlePropsChange(newProps: Record<string, any>) {
    // Update each control value
    Object.entries(newProps).forEach(([key, value]) => {
      playgroundStore.updateControl(key, value);
    });
  }

  let copySuccess = $state(false);

  async function copyCodeToClipboard() {
    try {
      const code = generatedCode();
      await navigator.clipboard.writeText(code);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<div class="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
  <!-- Toolbar -->
  <PlaygroundToolbar
    componentName={data.story.componentName}
    category={data.story.category}
  />

  <!-- Main content area -->
  <div class="flex-1 flex overflow-hidden relative">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-pink-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Sidebar -->
    <PlaygroundSidebar>
      {#if playgroundStore.state.sidebarOpen}
        <div class="p-6 h-full overflow-auto">
          <!-- Category Badge -->
          <div class="mb-6">
            <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-800">
              {data.story.category}
            </span>
          </div>

          <!-- Current Props Section -->
          <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 shadow-lg mb-6">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Current Props
            </h3>
            <div class="space-y-3 text-sm">
              {#if Object.keys(playgroundStore.controlValues).length === 0}
                <div class="text-center py-8">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p class="text-gray-500 dark:text-gray-400 text-xs">
                    No props configured yet.<br/>
                    Use Controls below to customize.
                  </p>
                </div>
              {:else}
                {#each Object.entries(playgroundStore.controlValues) as [key, value]}
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <div class="flex items-start justify-between gap-2">
                      <span class="font-mono font-semibold text-indigo-700 dark:text-indigo-300 text-xs">{key}</span>
                      <span class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                        {typeof value}
                      </span>
                    </div>
                    <div class="mt-2 font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                      {JSON.stringify(value, null, 2)}
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>

          <!-- Info Card -->
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-800">
            <h4 class="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2">Keyboard Shortcuts</h4>
            <ul class="space-y-1.5 text-xs text-indigo-700 dark:text-indigo-300">
              <li class="flex items-center justify-between">
                <span>Toggle Sidebar</span>
                <kbd class="px-2 py-0.5 bg-white dark:bg-gray-800 rounded border border-indigo-300 dark:border-indigo-700 font-mono text-[10px]">Ctrl+/</kbd>
              </li>
              <li class="flex items-center justify-between">
                <span>Dark Mode</span>
                <kbd class="px-2 py-0.5 bg-white dark:bg-gray-800 rounded border border-indigo-300 dark:border-indigo-700 font-mono text-[10px]">Ctrl+D</kbd>
              </li>
              <li class="flex items-center justify-between">
                <span>Toggle Panel</span>
                <kbd class="px-2 py-0.5 bg-white dark:bg-gray-800 rounded border border-indigo-300 dark:border-indigo-700 font-mono text-[10px]">Ctrl+B</kbd>
              </li>
              <li class="flex items-center justify-between">
                <span>Toggle Grid</span>
                <kbd class="px-2 py-0.5 bg-white dark:bg-gray-800 rounded border border-indigo-300 dark:border-indigo-700 font-mono text-[10px]">Ctrl+G</kbd>
              </li>
            </ul>
          </div>
        </div>
      {/if}
    </PlaygroundSidebar>

    <!-- Canvas with viewport controls -->
    <div class="flex-1 overflow-hidden">
      <Canvas>
        {#if data.story.component}
          {@const StoryComponent = data.story.component}
          {#key data.story.id}
            <StoryComponent />
          {/key}
        {/if}
      </Canvas>
    </div>
  </div>

  <!-- Bottom Panel - Enhanced -->
  <BottomPanel>
    {#if playgroundStore.uiState.bottomPanelOpen}
      <div class="grid grid-cols-2 gap-6 h-full p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <!-- Controls Panel -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
          <div class="overflow-auto h-full">
            <PlaygroundControlPanel />
          </div>
        </div>

        <!-- Live Code Preview -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
          <div class="overflow-auto h-full">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Live Code Preview
                </h3>
                <button
                  onclick={copyCodeToClipboard}
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border-2 border-indigo-200 dark:border-indigo-800 hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md"
                  title={copySuccess ? 'Copied!' : 'Copy code'}
                >
                  {#if copySuccess}
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-green-600 dark:text-green-400">Copied!</span>
                  {:else}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  {/if}
                </button>
              </div>
              <GenericCodeViewer code={generatedCode()} language="svelte" />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </BottomPanel>
</div>
