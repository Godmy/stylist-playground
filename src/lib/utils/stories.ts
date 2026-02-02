// Тип для истории (story)
import type { ControlConfig } from '../components/types';

export interface Story {
  path: string;
  component: any;
  componentName: string;
  category: string;
  subcategory?: string;
  id: string;
  title?: string;
  description?: string;
  controls?: ControlConfig[];
}

// Тип для сгруппированных историй
interface GroupedStories {
  [category: string]: {
    [subcategory: string]: Story[];
  };
}

// Динамическая загрузка всех story файлов из stylist-svelte
// Используем glob для ЛЕНИВОЙ загрузки .story.svelte файлов
// Это предотвращает массовую загрузку всех компонентов при старте приложения
const storyModules = import.meta.glob<any>(
  '../../../../stylist-svelte/src/lib/components/**/*.story.svelte'
  // БЕЗ { eager: true } - возвращает функции-загрузчики вместо модулей
);

// Вспомогательная функция для извлечения метаданных из пути
function extractStoryMetadata(path: string) {
  const normalizedPath = path.replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/');
  const fileName = pathParts[pathParts.length - 1];

  // Если файл называется index.story.svelte, используем имя родительской папки
  let componentName = fileName.replace('.story.svelte', '');
  if (componentName === 'index') {
    componentName = pathParts[pathParts.length - 2]; // Берем имя папки
  }

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

  const id = `${rawCategory}${rawSubcategory ? '-' + rawSubcategory : ''}-${componentName}`.toLowerCase();

  return {
    normalizedPath,
    componentName,
    category,
    subcategory,
    rawCategory,
    rawSubcategory,
    id
  };
}

// Преобразуем пути в массив историй (БЕЗ загрузки компонентов)
// Компоненты будут загружены только при необходимости через getStoryById
const allStories: Story[] = Object.keys(storyModules).map((path) => {
  const metadata = extractStoryMetadata(path);

  return {
    path: metadata.normalizedPath,
    component: null, // Компонент будет загружен лениво при запросе
    componentName: metadata.componentName,
    category: metadata.category,
    subcategory: metadata.subcategory,
    id: metadata.id
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

// Кеш загруженных компонентов для предотвращения повторной загрузки
const loadedComponents = new Map<string, any>();

// Функция для получения истории по ID с ленивой загрузкой компонента
export const getStoryById = async (id: string): Promise<Story | undefined> => {
  const story = allStories.find((story) => story.id === id);

  if (!story) {
    return undefined;
  }

  // Если компонент уже загружен, возвращаем сторю с кешированным компонентом
  if (loadedComponents.has(story.path)) {
    return {
      ...story,
      component: loadedComponents.get(story.path)
    };
  }

  // Загружаем компонент лениво
  const loader = storyModules[story.path];
  if (loader) {
    try {
      const module = await loader();
      const component = module.default;
      const controls = module.controls ?? component?.controls;

      // Сохраняем в кеш
      loadedComponents.set(story.path, component);

      return {
        ...story,
        component,
        controls
      };
    } catch (error) {
      console.error(`Failed to load story component for ${id}:`, error);
      return undefined;
    }
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
