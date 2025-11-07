<script lang="ts">
  // @ts-ignore
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  // Указываем тип для page, чтобы избежать ошибки TypeScript
  type PageType = typeof page;
  let _page: PageType = page;
  
  // Параметры компонента с использованием $props()
  const { 
    category = '', 
    componentName = '' 
  } = $props<{ 
    category?: string; 
    componentName?: string; 
  }>();
  
  // Состояния для истории навигации
  let canGoBack = $state(false);
  let canGoForward = $state(false);
  let history = $state<string[]>([]);
  let currentIndex = $state(0);
  
  // Состояния для быстрых действий
  let animationsEnabled = $state(true);
  
  onMount(() => {
    // Подписываемся на изменения страницы для отслеживания истории
    const unsubscribe = page.subscribe((value: any) => {
      // В реальном приложении здесь будет логика отслеживания истории
      // Для упрощения в этом примере просто устанавливаем возможности навигации
      canGoBack = window.history.state?.back !== undefined;
      canGoForward = window.history.state?.forward !== undefined;
    });
    
    return () => unsubscribe();
  });
  
  // Функции для навигации
  const goBack = () => {
    window.history.back();
  };
  
  const goForward = () => {
    window.history.forward();
  };
  
  // Функция для копирования ссылки
  const shareStory = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      // В реальном приложении здесь будет уведомление
      console.log('Ссылка скопирована в буфер обмена');
    } catch (err) {
      console.error('Не удалось скопировать ссылку:', err);
    }
  };
  
  // Функция для случайных значений
  const randomizeProps = () => {
    // В реальном приложении здесь будет логика изменения пропсов
    console.log('Случайные значения применены');
  };
  
  // Функция для переключения анимаций
  const toggleAnimations = () => {
    animationsEnabled = !animationsEnabled;
    // В реальном приложении здесь будет логика включения/выключения анимаций
    console.log(`Анимации ${animationsEnabled ? 'включены' : 'выключены'}`);
  };
  
  // Функция для создания скриншота
  const takeScreenshot = () => {
    // В реальном приложении здесь будет логика создания скриншота
    console.log('Скриншот компонента');
  };
</script>

<div class="toolbar bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
  <!-- Хлебные крошки -->
  <div class="flex items-center space-x-2 text-sm">
    <a href="/" class="text-indigo-600 dark:text-indigo-400 hover:underline">Главная</a>
    <span class="text-gray-400">/</span>
    <span class="capitalize text-gray-600 dark:text-gray-300">{category}</span>
    <span class="text-gray-400">/</span>
    <span class="font-medium text-gray-800 dark:text-white">{componentName}</span>
  </div>
  
  <!-- Кнопки навигации -->
  <div class="flex items-center space-x-2">
    <button 
      onclick={goBack}
      disabled={!canGoBack}
      class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Назад"
    >
      ←
    </button>
    <button 
      onclick={goForward}
      disabled={!canGoForward}
      class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Вперед"
    >
      →
    </button>
  </div>
  
  <!-- Быстрые действия -->
  <div class="flex items-center space-x-2">
    <button 
      onclick={randomizeProps}
      class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Случайные значения"
    >
      🎲
    </button>
    <button 
      onclick={toggleAnimations}
      class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Анимации"
    >
      {animationsEnabled ? '▶️' : '⏸️'}
    </button>
    <button 
      onclick={takeScreenshot}
      class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Скриншот"
    >
      📸
    </button>
    <button 
      onclick={shareStory}
      class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Поделиться"
    >
      🔗
    </button>
  </div>
</div>