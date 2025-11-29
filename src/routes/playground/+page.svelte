<script lang="ts">
  import {
    playgroundStore,
    Canvas,
    ComponentTree
  } from '@stylist-svelte/playground';
  import { onMount, getContext } from 'svelte';
  import {
    groupedStories,
    getStoryById,
    type Story as PlaygroundStory
  } from '../../lib/utils/stories';
  import AnimatedBackground from '../../lib/components/playground/AnimatedBackground.svelte';
  import DrawingOverlay from '../../lib/components/playground/DrawingOverlay.svelte';
  import AIPanel from '../../lib/components/playground/AIPanel.svelte';
  import AIAssistant from '../../lib/components/playground/AIAssistant.svelte';

  const messages = {
    loading: '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442...',
    loadErrorDescription:
      '\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u0438\u043b\u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u0434\u0440\u0443\u0433\u043e\u0439 \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0434\u0435\u0440\u0435\u0432\u0430.',
    retryButton: '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0443',
    noComponentDescription:
      '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442 \u0438\u0437 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u0438 \u043d\u0430\u0447\u0438\u043d\u0430\u0439\u0442\u0435 \u044d\u043a\u0441\u043f\u0435\u0440\u0438\u043c\u0435\u043d\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441 \u0436\u0438\u0432\u044b\u043c\u0438 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u0430\u043c\u0438 \u0438 \u044d\u043a\u0441\u043f\u043e\u0440\u0442\u043e\u043c.',
    selectButton: '\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442',
    notFound: '\u041a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d',
    loadError: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442',
    loadErrorLog:
      '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442 \u043f\u0435\u0441\u043e\u0447\u043d\u0438\u0446\u044b'
  };

  // Get component tree visibility from layout context
  const componentTreeContext = getContext<{ value: boolean }>('showComponentTree');
  let showComponentTree = $derived(componentTreeContext?.value ?? false);

  // Get AI panel visibility from layout context
  const aiPanelContext = getContext<{ value: boolean }>('showAIPanel');
  let showAIPanel = $derived(aiPanelContext?.value ?? false);

  // Get drawing mode context
  const drawingModeContext = getContext<{ value: boolean }>('drawingMode');
  let drawingMode = $derived(drawingModeContext?.value ?? false);

  const drawColorContext = getContext<{ value: string }>('drawColor');
  let drawColor = $derived(drawColorContext?.value ?? '#ef4444');

  // Selected component state
  let selectedStoryId = $state<string | null>(null);
  let selectedStory = $state<PlaygroundStory | null>(null);
  let isStoryLoading = $state(false);
  let loadError = $state<string | null>(null);
  let storyLoadToken = 0;

  // AI chat state
  let showAIChatWindow = $state(false);
  let activeAIProvider = $state<'gemini' | 'qwen' | 'claude' | 'codex'>('gemini');

  // Handle component selection from tree
  async function handleComponentSelect(storyId: string) {
    if (!storyId) return;
    if (storyId === selectedStoryId && selectedStory) {
      return;
    }

    selectedStoryId = storyId;
    selectedStory = null;
    loadError = null;
    isStoryLoading = true;

    const currentToken = ++storyLoadToken;

    try {
      const story = await getStoryById(storyId);

      if (currentToken !== storyLoadToken) {
        return;
      }

      if (!story) {
        loadError = messages.notFound;
        return;
      }

      selectedStory = story;
    } catch (error) {
      if (currentToken !== storyLoadToken) {
        return;
      }

      console.error(messages.loadErrorLog, error);

      // Extract user-friendly error message
      if (error instanceof Error) {
        loadError = error.message;
      } else {
        loadError = messages.loadError;
      }
    } finally {
      if (currentToken === storyLoadToken) {
        isStoryLoading = false;
      }
    }
  }

  // Initialize playground
  onMount(() => {
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

  .accent-outline-button {
    border: 1px solid color-mix(in srgb, var(--playground-accent, #FF6B35) 40%, transparent);
    color: var(--playground-accent, #FF6B35);
    transition: all 160ms ease;
  }

  .accent-outline-button:hover {
    background-color: var(--playground-accent, #FF6B35);
    color: var(--playground-accent-contrast, #FFFFFF);
    border-color: var(--playground-accent, #FF6B35);
  }

  .accent-spinner {
    border-color: var(--playground-spinner-border, rgba(255, 143, 110, 0.7));
    border-top-color: transparent;
  }
</style>

<div class="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">

  <!-- Main content area -->
  <div class="flex-1 flex overflow-hidden min-h-0 max-h-full">
    <!-- Component tree sidebar (conditional with animation) -->
    {#if showComponentTree}
      <div
        class="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl sidebar-enter"
        style="height: 100%; display: grid; grid-template-rows: 1fr; box-shadow: 0 20px 45px var(--playground-accent-shadow, rgba(255, 107, 53, 0.18));"
      >
        <ComponentTree
          {groupedStories}
          onComponentSelect={handleComponentSelect}
          selectedStoryId={selectedStoryId}
        />
      </div>
    {/if}

    <!-- AI Panel sidebar (conditional with animation) -->
    {#if showAIPanel}
      <div
        class="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl sidebar-enter"
        style="height: 100%; display: grid; grid-template-rows: 1fr; box-shadow: 0 20px 45px rgba(147, 51, 234, 0.18);"
      >
        <AIPanel
          onOptionSelect={(providerId, optionId) => {
            console.log('Selected:', providerId, optionId);
          }}
          onStartChat={(providerId) => {
            activeAIProvider = providerId;
            showAIChatWindow = true;
          }}
        />
      </div>
    {/if}

    <!-- Main content -->
    <div class="flex-1 h-full flex flex-col overflow-hidden">
      {#if showComponentTree}
        <Canvas component={selectedStory?.component}>
          {#if isStoryLoading}
            <div class="flex flex-col items-center justify-center gap-4 min-h-[400px] text-center">
              <div class="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin accent-spinner"></div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {messages.loading}
              </p>
            </div>
  {:else if loadError}
            <div class="flex flex-col items-center justify-center gap-4 min-h-[400px] text-center px-6">
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{loadError}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                {messages.loadErrorDescription}
              </p>
              {#if selectedStoryId}
                <button
                  onclick={() => selectedStoryId && handleComponentSelect(selectedStoryId)}
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 rounded-lg font-medium accent-outline-button"
                >
                  {messages.retryButton}
                </button>
              {/if}
            </div>
          {:else}
            <div class="flex flex-col items-center justify-center text-center gap-6 min-h-[400px] px-6 py-12">
              <div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Interactive Playground
                </h2>

                <p class="text-base text-gray-600 dark:text-gray-400">
                  {messages.noComponentDescription}
                </p>
              </div>

              <button
                onclick={() => (window as any).__toggleComponentTree?.()}
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF3E00] to-[#FF6B35] text-white rounded-lg font-medium hover:shadow-xl hover:shadow-[#FF3E00]/30 transition-all duration-200 hover:scale-105"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {messages.selectButton}
              </button>
            </div>
          {/if}
        </Canvas>
      {:else}
        <!-- Show welcome message when STYLIST is off -->
        <div class="flex-1 relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <AnimatedBackground>
            <div class="flex-1 flex flex-col items-center justify-center text-center gap-6 px-6 py-12 min-h-full">
              <div>
                <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to STYLIST
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Откройте дерево компонентов, нажав на кнопку <span class="font-bold text-orange-600 dark:text-orange-400">STYLIST</span> в левом верхнем углу, чтобы начать работу с интерактивным playground.
                </p>
              </div>

              <button
                onclick={() => (window as any).__toggleComponentTree?.()}
                class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF3E00] to-[#FF6B35] text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#FF3E00]/40 transition-all duration-200 hover:scale-105"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Открыть STYLIST
              </button>
            </div>
          </AnimatedBackground>
        </div>
      {/if}
    </div>
  </div>

  <!-- Drawing overlay -->
  {#if drawingMode}
    <DrawingOverlay
      {drawColor}
      onClose={() => drawingModeContext && (drawingModeContext.value = false)}
    />
  {/if}

  <!-- AI Chat window -->
  {#if showAIChatWindow}
    <AIAssistant
      providerId={activeAIProvider}
      onClose={() => (showAIChatWindow = false)}
    />
  {/if}
</div>
