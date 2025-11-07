<script lang="ts">
  import { groupedStories, allStories } from '../lib/utils/stories';
  
  // Подсчитываем статистику
  const storiesCount = allStories.length;
  const categoriesCount = Object.keys(groupedStories).length;
  
  // Группируем истории по категориям для отображения карточек
  const popularComponents = [
    { name: 'Button', category: 'Atoms', description: 'Интерактивный элемент управления' },
    { name: 'Input', category: 'Atoms', description: 'Поле ввода текста' },
    { name: 'Avatar', category: 'Atoms', description: 'Отображение изображения пользователя' },
    { name: 'Badge', category: 'Atoms', description: 'Маленький информационный элемент' },
    { name: 'FormFieldGroup', category: 'Molecules', description: 'Группировка полей формы' },
    { name: 'EmptyState', category: 'Molecules', description: 'Отображение пустого состояния' }
  ];
</script>

<!-- Hero секция с градиентом -->
<div class="hero-section bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white py-16">
  <div class="container mx-auto px-6 text-center">
    <h1 class="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">Stylist Component Library</h1>
    <p class="text-xl md:text-2xl text-white/90 mb-8">38+ компонентов для Svelte 5 с Tailwind CSS</p>
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <a 
        href="/story/atoms-button" 
        class="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
      >
        Попробовать Button
      </a>
      <a 
        href="/story/atoms-input" 
        class="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
      >
        Перейти к историям
      </a>
    </div>
  </div>
</div>

<!-- Интерактивная статистика -->
<div class="stats-container bg-gray-50 dark:bg-gray-900 py-12">
  <div class="container mx-auto px-6">
    <div class="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
        <div class="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{storiesCount}</div>
        <div class="text-gray-600 dark:text-gray-300">Компонентов</div>
      </div>
      <div class="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
        <div class="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">{categoriesCount}</div>
        <div class="text-gray-600 dark:text-gray-300">Категорий</div>
      </div>
      <div class="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
        <div class="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-2">100%</div>
        <div class="text-gray-600 dark:text-gray-300">TypeScript</div>
      </div>
    </div>
  </div>
</div>

<!-- Карточки быстрого старта -->
<div class="quick-start-container py-16">
  <div class="container mx-auto px-6">
    <h2 class="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Популярные компоненты</h2>
    
    <div class="quick-start-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each popularComponents as component}
        <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">{component.name}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{component.category} • {component.description}</p>
              </div>
              <span class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs px-2 py-1 rounded-full">
                {component.category}
              </span>
            </div>
            
            <div class="mt-4">
              <div class="h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                <p class="text-gray-500 dark:text-gray-400 text-sm">Превью компонента</p>
              </div>
              
              <a 
                href="/story/{component.category.toLowerCase()}-{component.name.toLowerCase()}" 
                class="w-full block text-center py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Открыть в playground →
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>