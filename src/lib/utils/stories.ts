// Тип для истории (story)
type Story = {
  path: string;
  component: any;
  componentName: string;
  category: string;
  id: string;
};

// Утилиты для работы с историями (stories)
// Динамическая загрузка всех story файлов
const storyModules = import.meta.glob(
  '../../../stylist-svelte/src/lib/components/**/*.story.svelte',
  { eager: true }
) as Record<string, { default: any }>;

// Преобразуем загруженные модули в массив историй
const allStories: Story[] = Object.entries(storyModules)
  .map(([path, module]) => {
    // Извлекаем имя компонента и категорию из пути
    const normalizedPath = path.replace(/\\/g, '/');
    const pathParts = normalizedPath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const componentName = fileName.replace('.story.svelte', '');
    const category = pathParts[pathParts.length - 3]; // atom, molecule, organism
    
    return {
      path: normalizedPath,
      component: module.default,
      componentName,
      category,
      id: `${category}-${componentName}`.toLowerCase()
    };
  })
  .filter(entry => entry.component);

// Группируем истории по категориям
const groupedStories: Record<string, Story[]> = {};

allStories.forEach(story => {
  const categoryKey = story.category.charAt(0).toUpperCase() + story.category.slice(1);
  if (!groupedStories[categoryKey]) {
    groupedStories[categoryKey] = [];
  }
  groupedStories[categoryKey].push(story);
});

export { allStories, groupedStories };

// Функция для получения истории по ID
export const getStoryById = (id: string): Story | undefined => {
  return allStories.find(story => story.id === id);
};