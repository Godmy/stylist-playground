<script lang="ts">
  import {
    playgroundStore,
    Canvas,
    ComponentTree
  } from '@stylist-svelte/playground';
  import { onMount, getContext } from 'svelte';
  import { groupedStories } from '../../lib/utils/stories';

  // Get component tree visibility from layout context
  const componentTreeContext = getContext<{ value: boolean }>('showComponentTree');
  let showComponentTree = $derived(componentTreeContext?.value ?? false);

  // Selected component state
  let selectedStoryId = $state<string | null>(null);

  // Handle component selection from tree
  function handleComponentSelect(storyId: string) {
    selectedStoryId = storyId;
    // In a real implementation, you would load the component here
    // For now, we'll just store the ID
  }

  // Initialize playground
  onMount(() => {
    // Set up default UI state
    playgroundStore.init();
  });
</script>

<style>
  .sidebar-enter {
    animation: slideInLeft 0.3s ease-out;
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>

<div class="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">

  <!-- Main content area -->
  <div class="flex-1 flex overflow-hidden min-h-0 max-h-full">
    <!-- Component tree sidebar (conditional with animation) -->
    {#if showComponentTree}
      <div class="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl shadow-[#FF3E00]/5 sidebar-enter" style="height: 100%; display: grid; grid-template-rows: 1fr;">
        <ComponentTree
          {groupedStories}
          onComponentSelect={handleComponentSelect}
        />
      </div>
    {/if}

    <!-- Main content -->
    <div class="flex-1 h-full flex flex-col overflow-hidden">
      {#if selectedStoryId}
        <!-- Canvas area when component is selected -->
        <Canvas />
      {:else}
        <!-- Welcome screen when no component selected -->
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center max-w-2xl mx-auto p-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Playground
            </h2>

            <p class="text-base text-gray-600 dark:text-gray-400 mb-8">
              Выберите компонент из библиотеки и начните экспериментировать с живыми контролами
            </p>

            <button
              onclick={() => (window as any).__toggleComponentTree?.()}
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF3E00] to-[#FF6B35] text-white rounded-lg font-medium hover:shadow-xl hover:shadow-[#FF3E00]/30 transition-all duration-200 hover:scale-105"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Выбрать компонент
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
