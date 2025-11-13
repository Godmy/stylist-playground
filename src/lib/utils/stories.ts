// Тип для истории (story)
export interface Story {
  path: string;
  component: any;
  componentName: string;
  category: string;
  subcategory?: string;
  id: string;
  title?: string;
  description?: string;
}

// Тип для сгруппированных историй
interface GroupedStories {
  [category: string]: {
    [subcategory: string]: Story[];
  };
}

// Динамическая загрузка всех story файлов из stylist-svelte
// Используем glob для загрузки .story.svelte файлов
// Use eager: false to avoid SSR issues with $lib imports
const storyModules = import.meta.glob<any>(
  '../../../../stylist-svelte/src/lib/components/**/*.story.svelte',
  { eager: false }
);

// Преобразуем пути в массив историй (без загрузки компонентов)
const allStories: Story[] = Object.keys(storyModules)
  .map((path) => {
    // Извлекаем имя компонента и категории из пути
    const normalizedPath = path.replace(/\\/g, '/');
    const pathParts = normalizedPath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const componentName = fileName.replace('.story.svelte', '');

    // Категория - atoms, molecules, organisms
    const categoryIndex = pathParts.indexOf('components') + 1;
    const subcategoryIndex = pathParts.indexOf('components') + 2;

    const rawCategory = categoryIndex < pathParts.length ? pathParts[categoryIndex] : 'general';
    const rawSubcategory =
      subcategoryIndex < pathParts.length &&
      !fileName.toLowerCase().includes(pathParts[subcategoryIndex])
        ? pathParts[subcategoryIndex]
        : undefined;

    // Normalize category to have capital first letter
    const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
    const subcategory = rawSubcategory
      ? rawSubcategory.charAt(0).toUpperCase() + rawSubcategory.slice(1)
      : undefined;

    return {
      path: normalizedPath,
      component: storyModules[path], // Store the loader function
      componentName,
      category,
      subcategory,
      id: `${rawCategory}${rawSubcategory ? '-' + rawSubcategory : ''}-${componentName}`.toLowerCase()
    };
  });

// Группируем истории по категориям и подкатегориям
const groupedStories: GroupedStories = {};

allStories.forEach((story) => {
  const categoryKey = story.category;
  const subcategoryKey = story.subcategory || 'General';

  if (!groupedStories[categoryKey]) {
    groupedStories[categoryKey] = {};
  }

  if (!groupedStories[categoryKey][subcategoryKey]) {
    groupedStories[categoryKey][subcategoryKey] = [];
  }

  groupedStories[categoryKey][subcategoryKey].push(story);
});

export { allStories, groupedStories };

// Функция для получения истории по ID
export const getStoryById = async (id: string): Promise<Story | undefined> => {
  const story = allStories.find((story) => story.id === id);

  if (!story) {
    return undefined;
  }

  // If component is a function (lazy loader), load it
  if (typeof story.component === 'function') {
    const module = await story.component();
    return {
      ...story,
      component: module.default
    };
  }

  return story;
};

// Функция для получения списка всех категорий
export const getCategories = (): string[] => {
  return Object.keys(groupedStories);
};

// Функция для получения списка подкатегорий в заданной категории
export const getSubcategories = (category: string): string[] => {
  return groupedStories[category] ? Object.keys(groupedStories[category]) : [];
};

// Функция для получения историй по категории и опционально подкатегории
export const getStoriesByCategory = (category: string, subcategory?: string): Story[] => {
  const categoryKey = category.charAt(0).toUpperCase() + category.slice(1);
  if (!groupedStories[categoryKey]) {
    return [];
  }

  if (subcategory) {
    const subcategoryKey = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
    return groupedStories[categoryKey][subcategoryKey] || [];
  } else {
    // Возвращаем все истории в категории
    let allCategoryStories: Story[] = [];
    Object.values(groupedStories[categoryKey]).forEach((stories) => {
      allCategoryStories = allCategoryStories.concat(stories);
    });
    return allCategoryStories;
  }
};
