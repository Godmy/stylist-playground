import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import { allStories, getStoryById, type Story } from '../utils/stories';

// Типы для состояния навигации
export interface NavigationState {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedStoryId: string | null;
  searchQuery: string;
  typeFilter: string | null; // 'atoms', 'molecules', 'organisms'
}

// Создание stores
export const selectedCategory = writable<string | null>(null);
export const selectedSubcategory = writable<string | null>(null);
export const selectedStoryId = writable<string | null>(null);
export const searchQuery = writable<string>('');
export const typeFilter = writable<string | null>(null);

// Derived store для отфильтрованных историй
export const filteredStories: Readable<Story[]> = derived(
  [searchQuery, typeFilter, selectedCategory],
  ([$searchQuery, $typeFilter, $selectedCategory]) => {
    let stories = allStories;

    // Фильтрация по поисковому запросу
    if ($searchQuery) {
      const query = $searchQuery.toLowerCase();
      stories = stories.filter(story =>
        story.componentName.toLowerCase().includes(query) ||
        story.category.toLowerCase().includes(query) ||
        story.subcategory?.toLowerCase().includes(query)
      );
    }

    // Фильтрация по типу компонента
    if ($typeFilter) {
      stories = stories.filter(story =>
        story.category.toLowerCase() === $typeFilter.toLowerCase()
      );
    }

    // Фильтрация по выбранной категории
    if ($selectedCategory) {
      stories = stories.filter(story =>
        (story.category.charAt(0).toUpperCase() + story.category.slice(1)) === $selectedCategory
      );
    }

    return stories;
  }
);

// Derived store для группировки отфильтрованных историй
export const filteredGroupedStories: Readable<Record<string, Record<string, Story[]>>> = derived(
  [filteredStories],
  ([$filteredStories]) => {
    const grouped: Record<string, Record<string, Story[]>> = {};

    $filteredStories.forEach(story => {
      const category = story.category.charAt(0).toUpperCase() + story.category.slice(1);
      const subcategory = story.subcategory || 'General';

      if (!grouped[category]) {
        grouped[category] = {};
      }
      if (!grouped[category][subcategory]) {
        grouped[category][subcategory] = [];
      }
      grouped[category][subcategory].push(story);
    });

    return grouped;
  }
);

// Async derived store для текущей истории
// Store для текущей истории  
let currentStoryStore = writable<Story | null>(null);

// Подписываемся на изменения selectedStoryId и обновляем currentStory
selectedStoryId.subscribe(async (storyId) => {
  if (!storyId) {
    currentStoryStore.set(null);
    return;
  }
  
  try {
    const story = await getStoryById(storyId);
    currentStoryStore.set(story || null);
  } catch (error) {
    console.error('Error loading story:', error);
    currentStoryStore.set(null);
  }
});

export const currentStory = currentStoryStore;

// Действия (actions)
export const navigationActions = {
  setCategory: (category: string | null) => {
    selectedCategory.set(category);
  },

  setSubcategory: (subcategory: string | null) => {
    selectedSubcategory.set(subcategory);
  },

  setStory: (storyId: string | null) => {
    selectedStoryId.set(storyId);
  },

  setSearchQuery: (query: string) => {
    searchQuery.set(query);
    // Автоматически сбрасываем категорию при поиске
    if (query) {
      selectedCategory.set(null);
    }
  },

  clearSearch: () => {
    searchQuery.set('');
  },

  toggleTypeFilter: (type: string) => {
    typeFilter.update(current =>
      current === type.toLowerCase() ? null : type.toLowerCase()
    );
  },

  reset: () => {
    selectedCategory.set(null);
    selectedSubcategory.set(null);
    selectedStoryId.set(null);
    searchQuery.set('');
    typeFilter.set(null);
  }
};
