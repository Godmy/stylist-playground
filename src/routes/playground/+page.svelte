<script lang="ts">
  import {
    AIAssistant,
    AIPanel,
    AnimatedBackground,
    Canvas,
    ComponentTree,
    DrawingOverlay,
    allStories,
    getStoryById,
    groupedStories,
    playgroundStore,
    type StoryConfig
  } from '$playground/playground';
  import type { Story as PlaygroundStory } from '$playground/playground/stories';
  import { onMount } from 'svelte';

  const messages = {
    loading: 'Загружаем компонент...',
    loadErrorDescription:
      'Проверьте подключение или попробуйте выбрать другой элемент дерева.',
    retryButton: 'Повторить загрузку',
    noComponentDescription:
      'Выберите компонент из библиотеки и начинайте экспериментировать с живыми контролами и экспортом.',
    selectButton: 'Выбрать компонент',
    notFound: 'Компонент не найден',
    loadError: 'Не удалось загрузить компонент',
    loadErrorLog:
      'Не удалось загрузить компонент песочницы'
  };

  // Populate the central store with all the stories found by stories.ts
  // ВАЖНО: Компоненты регистрируются БЕЗ загрузки - они будут загружены лениво при выборе
  onMount(() => {
    if (allStories && allStories.length > 0) {
      allStories.forEach((story) => {
        const storyConfig: StoryConfig = {
          id: story.id,
          title: story.componentName,
          component: null, // Компонент будет загружен лениво при выборе в handleComponentSelect
          category: story.category
          // controls are not part of the static analysis, they are registered by the Story component itself at runtime
        };
        playgroundStore.registerStory(storyConfig);
      });

      // If a story was loaded from URL/localStorage, re-trigger setCurrentStory
      // to ensure controls are initialized now that the stories are registered.
      const initialStoryId = playgroundStore.state.currentStoryId;
      if (initialStoryId) {
        // Defer to next tick to ensure all stories are registered
        setTimeout(() => {
          playgroundStore.setCurrentStory(initialStoryId);
          // Загружаем компонент сразу, если есть initialStoryId
          handleComponentSelect(initialStoryId);
        }, 0);
      }
    }

    // Auto-open component tree when landing on /playground without a specific component
    // This provides a better UX than showing an empty welcome screen
    if (!playgroundStore.state.currentStoryId && !playgroundStore.uiState.componentTreeOpen) {
      // Очищаем любую предвыборку перед открытием дерева
      selectedStory = null;
      playgroundStore.toggleComponentTree();
    }
  });

  // Derive UI state from the central store
  let showComponentTree = $derived(playgroundStore.uiState.componentTreeOpen);
  let showAIPanel = $derived(playgroundStore.uiState.aiPanelOpen);
  let drawingMode = $derived(playgroundStore.uiState.drawingMode);
  let drawColor = $derived(playgroundStore.uiState.drawColor);

  // Story loading state remains local to this page to avoid circular dependencies
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

    // Если компонент уже загружен и отображается, не перезагружаем
    if (storyId === playgroundStore.state.currentStoryId && selectedStory && selectedStory.component) {
      return;
    }

    playgroundStore.setCurrentStory(storyId);
    selectedStory = null;
    loadError = null;
    isStoryLoading = true;

    const currentToken = ++storyLoadToken;

    try {
      // getStoryById загружает компонент лениво - только при первом запросе
      const story = await getStoryById(storyId);

      if (currentToken !== storyLoadToken) {
        return;
      }

      if (!story) {
        loadError = messages.notFound;
        return;
      }

      selectedStory = story;

      // Update store with loaded controls and reapply defaults
      playgroundStore.registerStory({
        id: story.id,
        title: story.componentName,
        component: story.component,
        category: story.category,
        controls: story.controls
      });
      playgroundStore.setCurrentStory(story.id);
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

      // Clear current story to prevent auto-reload loop on errors
      playgroundStore.setCurrentStory(null);
    } finally {
      if (currentToken === storyLoadToken) {
        isStoryLoading = false;
      }
    }
  }
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
          selectedStoryId={playgroundStore.state.currentStoryId || null}
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
          onOptionSelect={() => {}}
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
        <Canvas component={selectedStory?.component} props={playgroundStore.controlValues}>
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
              {#if playgroundStore.state.currentStoryId}
                <button
                  onclick={() => playgroundStore.state.currentStoryId && handleComponentSelect(playgroundStore.state.currentStoryId)}
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
                onclick={() => playgroundStore.toggleComponentTree()}
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
                onclick={() => playgroundStore.toggleComponentTree()}
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
      onClose={() => playgroundStore.setDrawingMode(false)}
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
