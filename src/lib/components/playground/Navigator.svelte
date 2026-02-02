<script lang="ts">
  import { playgroundStore } from '../stores/playground.svelte';
  import type { StoryConfig } from '../types';

  let storiesByCategory = $derived(playgroundStore.getStoriesByCategory());
  let currentStoryId = $derived(playgroundStore.state.currentStoryId);
  let searchQuery = $state('');

  function selectStory(id: string) {
    playgroundStore.setCurrentStory(id);
  }

  let filteredCategories = $derived(() => {
    if (!searchQuery) return storiesByCategory;

    const filtered = new Map();
    const query = searchQuery.toLowerCase();

    storiesByCategory.forEach((stories: StoryConfig[], category: string) => {
      const matchedStories = stories.filter((story: StoryConfig) =>
        story.title.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query)
      );

      if (matchedStories.length > 0) {
        filtered.set(category, matchedStories);
      }
    });

    return filtered;
  });
</script>

<div class="flex flex-col h-full">
  <!-- Search -->
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search stories..."
        class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
      />
    </div>
  </div>

  <!-- Story List -->
  <nav class="flex-1 overflow-y-auto p-2">
    {#each [...filteredCategories()] as [category, stories]}
      <div class="mb-4">
        <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">{category}</h3>
        <ul class="space-y-1">
          {#each stories as story}
            <li>
              <button
                class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 {currentStoryId === story.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' : ''}"
                onclick={() => selectStory(story.id)}
              >
                <span class="block font-medium">{story.title}</span>
                {#if story.tags && story.tags.length > 0}
                  <span class="block text-xs text-gray-500 mt-0.5 dark:text-gray-400">
                    {story.tags.join(', ')}
                  </span>
                {/if}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/each}

    {#if filteredCategories().size === 0}
      <div class="flex items-center justify-center h-32 text-gray-500 text-sm">
        <p>No stories found</p>
      </div>
    {/if}
  </nav>
</div>
