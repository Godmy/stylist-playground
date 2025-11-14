<script lang="ts">
  import {
    playgroundStore,
    PlaygroundToolbar,
    PlaygroundSidebar,
    BottomPanel,
    Canvas,
    Navigator
  } from '@stylist-svelte/playground';
  import { onMount } from 'svelte';

  // Placeholder component info
  let componentName = $state('Playground');
  let category = $state('Preview');
  let subcategory = $state('Empty State');

  // Viewport presets
  type ViewportPreset = {
    name: string;
    width: number;
    height: number;
    icon: string;
  };

  const viewportPresets: ViewportPreset[] = [
    { name: 'Mobile', width: 375, height: 667, icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { name: 'Tablet', width: 768, height: 1024, icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { name: 'Desktop', width: 1440, height: 900, icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Full', width: 1920, height: 1080, icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' }
  ];

  let selectedViewport = $state<ViewportPreset>(viewportPresets[3]);
  let zoomLevel = $state(100);

  // Background pattern options
  let backgroundPattern = $state<'none' | 'dots' | 'grid'>('none');

  // Initialize playground
  onMount(() => {
    // Set up default UI state
    playgroundStore.init();
  });

  function handleViewportChange(preset: ViewportPreset) {
    selectedViewport = preset;
  }

  function handleZoomChange(value: number) {
    zoomLevel = value;
  }

  function toggleBackgroundPattern() {
    if (backgroundPattern === 'none') {
      backgroundPattern = 'dots';
    } else if (backgroundPattern === 'dots') {
      backgroundPattern = 'grid';
    } else {
      backgroundPattern = 'none';
    }
  }
</script>

<style>
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .float-animation {
    animation: float 6s ease-in-out infinite;
  }

  .fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    background-size: 1000px 100%;
    animation: shimmer 3s infinite;
  }

  .pulse-ring {
    animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  }

  .glassmorphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .bg-dots {
    background-image: radial-gradient(circle, rgba(99, 102, 241, 0.15) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .bg-grid {
    background-image:
      linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
</style>

<div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
  <!-- Toolbar -->
  <PlaygroundToolbar
    {componentName}
    {category}
    {subcategory}
  />

  <!-- Main Content Area -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Sidebar (collapsible) -->
    {#if playgroundStore.state.sidebarOpen}
      <div class="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        <PlaygroundSidebar>
          <div class="p-6">
              <div class="text-center py-12">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Component Selected
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Select a component to start experimenting
                </p>
                <a
                  href="/components"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Components
                </a>
              </div>
            </div>
          {/snippet}
        </PlaygroundSidebar>
      </div>
    {/if}

    <!-- Canvas Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Canvas>
        {#snippet children()}
          <!-- Empty state for playground -->
          <div class="flex items-center justify-center min-h-[400px]">
            <div class="text-center max-w-md mx-auto p-8">
              <div class="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-6 border-2 border-indigo-200 dark:border-indigo-800">
                <svg class="w-12 h-12 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>

              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Interactive Playground
              </h2>

              <p class="text-gray-600 dark:text-gray-400 mb-6">
                This is your creative workspace. Select a component from the library to start customizing and experimenting with live controls.
              </p>

              <div class="space-y-3">
                <a
                  href="/components"
                  class="block w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Choose a Component
                </a>

                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span>or</span>
                  <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <button
                    onclick={() => playgroundStore.toggleGrid()}
                    class="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                  >
                    {playgroundStore.uiState.showGrid ? 'Hide' : 'Show'} Grid
                  </button>

                  <button
                    onclick={() => playgroundStore.toggleDarkMode()}
                    class="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                  >
                    Toggle Theme
                  </button>
                </div>
              </div>

              <!-- Features preview -->
              <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Available Features
                </p>
                <div class="grid grid-cols-2 gap-3 text-left">
                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs text-gray-600 dark:text-gray-400">Live Controls</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs text-gray-600 dark:text-gray-400">Code Export</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs text-gray-600 dark:text-gray-400">Pan & Zoom</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs text-gray-600 dark:text-gray-400">Responsive Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/snippet}
      </Canvas>

      <!-- Bottom Panel (collapsible) -->
      {#if playgroundStore.uiState.bottomPanelOpen}
        <BottomPanel>
          <div class="p-6">
            <div class="text-center py-8">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Select a component to see controls and code
              </p>
            </div>
          </div>
        </BottomPanel>
      {/if}
    </div>
  </div>

</div>
