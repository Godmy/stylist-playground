<script lang="ts">
  import { StoryRoot } from 'stylist-svelte/playground';
  import '../app.css';
  import { onMount } from 'svelte';
  import { groupedStories, getStoryById, allStories } from '../lib/utils/stories';

  let isDarkMode = $state<boolean>(false);

  // Определение начальной темы
  onMount(() => {
    // Проверяем сохранённую тему или используем системную
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      isDarkMode = true;
    } else {
      document.documentElement.classList.remove('dark');
      isDarkMode = false;
    }
  });

  function toggleDarkMode() {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      isDarkMode = false;
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      isDarkMode = true;
    }
  }
  
  // Состояния для навигации
  let selectedCategory = $state<string | null>(null);
  let selectedStoryId = $state<string | null>(null);
  
  // Фильтрация историй по категории
  const filteredStories = $derived(() => {
    if (!selectedCategory) return allStories;
    return allStories.filter(story => 
      (story.category.charAt(0).toUpperCase() + story.category.slice(1)) === selectedCategory
    );
  });
  
  // Получение текущей истории
  const currentStory = $derived(() => {
    if (!selectedStoryId) return null;
    return getStoryById(selectedStoryId);
  });
  
  // Иконки для категорий
  const categoryIcons: Record<string, string> = {
    'Atoms': '⚛️',
    'Molecules': '🧬',
    'Organisms': '🦠',
    'Feedback': '💬',
    'Forms': '📝',
    'Media': '🖼️',
    'Navigation': '🧭',
    'Typography': '🔤',
    'UiElements': '🔘',
    'Indicators': '🔔',
    'Animation': '動き',
    'Canvas': '🎨',
    'Examples': '💡'
  };
  
  // Получение иконки для категории
  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || '📦';
  };
</script>

<div class="min-h-screen flex">
  <!-- Сайдбар навигации -->
  <aside class="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Stories</h2>
        <span class="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
          {allStories.length}
        </span>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto">
      {#each Object.entries(groupedStories) as [category, categoryStories]}
        <div class="mb-2">
          <button 
            class="w-full text-left px-4 py-3 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
            onclick={() => selectedCategory = selectedCategory === category ? null : category}
          >
            <div class="flex items-center space-x-2">
              <span>{getCategoryIcon(category)}</span>
              <span>{category}</span>
            </div>
            <div class="flex items-center">
              <span class="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
                {categoryStories.length}
              </span>
              <span class="ml-2">{selectedCategory === category ? '▼' : '▶'}</span>
            </div>
          </button>
          
          {#if selectedCategory === category}
            <div class="ml-6 mt-1">
              {#each categoryStories as story}
                <a
                  href="/story/{story.id}"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-r-lg border-l-4 border-transparent hover:border-indigo-400"
                  class:bg-indigo-100={selectedStoryId === story.id}
                  class:dark:bg-indigo-900-30={selectedStoryId === story.id}
                  class:border-indigo-500={selectedStoryId === story.id}
                  class:dark:border-indigo-400={selectedStoryId === story.id}
                  class:font-bold={selectedStoryId === story.id}
                >
                  {story.componentName}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
    
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>Stylist Playground v0.1.0</p>
      </div>
    </div>
  </aside>

  <!-- Основной контент -->
  <main class="flex-1">
    <StoryRoot title="Stylist Component Library">
      <slot />
    </StoryRoot>
  </main>
</div>

<button
  onclick={toggleDarkMode}
  class="fixed bottom-4 right-4 p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 z-50"
  aria-label="Toggle dark mode"
>
  {#if isDarkMode}
    ☀️
  {:else}
    🌙
  {/if}
</button>