<script lang="ts">
  import type { ComponentType } from 'svelte';
  
  // Параметры компонента с использованием $props()
  const { 
    component = null, 
    props = {} 
  } = $props<{ 
    component?: ComponentType | null; 
    props?: Record<string, any>; 
  }>();
  
  // Состояния для управления Canvas
  let canvasBackground = $state<'white' | 'gray' | 'dark' | 'grid' | 'dots'>('white');
  let viewport = $state<'mobile' | 'tablet' | 'desktop'>('desktop');
  let zoom = $state(1);
  let isFullscreen = $state(false);
  
  // Определяем классы фона в зависимости от выбранного варианта
  let backgroundClass = $derived(() => {
    return {
      'white': 'bg-white',
      'gray': 'bg-gray-100',
      'dark': 'bg-gray-900',
      'grid': 'bg-grid-pattern',
      'dots': 'bg-dots-pattern'
    }[canvasBackground];
  });
  
  // Определяем классы для viewport
  let viewportClasses = $derived(() => {
    return {
      'mobile': 'max-w-[375px] mx-auto h-[667px] overflow-auto',
      'tablet': 'max-w-[768px] mx-auto h-[1024px] overflow-auto',
      'desktop': 'w-full'
    }[viewport];
  });
  
  // Функции управления
  const toggleFullscreen = () => {
    isFullscreen = !isFullscreen;
  };
  
  const resetZoom = () => {
    zoom = 1;
  };
  
  // Применяем стили в зависимости от состояния
  let canvasStyle = $derived(() => {
    return `transform: scale(${zoom}); transform-origin: center top; transition: transform 0.2s ease;`;
  });
</script>

<style>
  .bg-grid-pattern {
    background-color: white;
    background-image: 
      linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  .bg-dots-pattern {
    background-color: white;
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
</style>

<!-- Контролы для Canvas -->
<div class="canvas-controls flex flex-wrap items-center gap-4 mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
  <div class="flex items-center space-x-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Фон:</label>
    <select 
      bind:value={canvasBackground}
      class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
    >
      <option value="white">Белый</option>
      <option value="gray">Серый</option>
      <option value="dark">Темный</option>
      <option value="grid">Сетка</option>
      <option value="dots">Точки</option>
    </select>
  </div>
  
  <div class="flex items-center space-x-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Размер:</label>
    <select 
      bind:value={viewport}
      class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
    >
      <option value="desktop">Рабочий стол</option>
      <option value="tablet">Планшет</option>
      <option value="mobile">Мобильный</option>
    </select>
  </div>
  
  <div class="flex items-center space-x-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Увеличение:</label>
    <button 
      onclick={() => zoom = Math.max(0.5, zoom - 0.1)}
      class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
    >
      -
    </button>
    <span class="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
    <button 
      onclick={() => zoom = Math.min(2, zoom + 0.1)}
      class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
    >
      +
    </button>
    <button 
      onclick={resetZoom}
      class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
    >
      Сброс
    </button>
  </div>
  
  <button 
    onclick={toggleFullscreen}
    class="ml-auto bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
  >
    {#if isFullscreen}Выход из полноэкранного{/if} режима
  </button>
</div>

<!-- Контейнер для компонента с настройками -->
<div class="canvas-container">
  <div 
    class="canvas-content {backgroundClass()} {viewportClasses()} rounded-lg shadow-lg overflow-hidden"
    style={canvasStyle()}
  >
    {#if component}
      {@render component({...props})}
    {:else}
      <div class="h-64 flex items-center justify-center text-gray-500">
        Компонент не доступен
      </div>
    {/if}
  </div>
</div>