<script lang="ts">
  // @ts-ignore
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  // Указываем тип для page, чтобы избежать ошибки TypeScript
  type PageType = typeof page;
  let _page: PageType = page;
  import { getStoryById } from '../../../lib/utils/stories';
  import Canvas from '../../../lib/components/Canvas.svelte';
  import ControlPanel from '../../../lib/components/ControlPanel.svelte';
  import Toolbar from '../../../lib/components/Toolbar.svelte';
  import CommentsPanel from '../../../lib/components/CommentsPanel.svelte';
  import ABTesting from '../../../lib/components/ABTesting.svelte';
  import A11yPanel from '../../../lib/components/A11yPanel.svelte';
  import DesignTokens from '../../../lib/components/DesignTokens.svelte';
  import CodeViewer from '../../../lib/components/CodeViewer.svelte';
  
  // Извлекаем ID истории из URL
  let storyId = $state<string | null>(null);
  let currentStory = $state<any>(null);
  let componentProps = $state<Record<string, any>>({});
  
  onMount(() => {
    // Получаем URL из store
    const unsubscribe = page.subscribe((value: any) => {
      const pathParts = value.url.pathname.split('/');
      if (pathParts.length >= 3 && pathParts[1] === 'story' && pathParts[2]) {
        if (pathParts[2]) {
          storyId = pathParts[2];
          currentStory = getStoryById(storyId!);
        }
        
        // Устанавливаем начальные пропсы для компонента
        if (currentStory && currentStory.component) {
          // Для простоты устанавливаем пустые пропсы - в реальности их нужно получить из компонента
          componentProps = {};
        }
      }
    });
    
    // Возвращаем функцию очистки
    return () => unsubscribe();
  });
  
  // Обработчик изменения пропсов
  const handlePropsChange = (newProps: Record<string, any>) => {
    componentProps = { ...newProps };
  };
  
  // Пример кода для отображения
  let exampleCode = $state('');
  
  // Пример кода для отображения
  // Функция для генерации примера кода
  const getExampleCode = (story: any, props: any) => {
    const componentName = story?.componentName || 'Component';
    const category = story?.category?.toLowerCase() || 'atoms';
    const propsStr = JSON.stringify(props, null, 2).replace(/\\/g, '\\\\').replace(/`/g, '\\`');
    
    // Поскольку мы не можем использовать < > в строках из-за парсера Svelte,
    // будем использовать переменную для хранения строки с тегом
    const lt = '<';
    const gt = '>';
    const componentTag = lt + componentName + ' {...props} ' + gt;
    
    return `<!-- Пример кода для ${componentName} -->
${lt}script${gt}
  import { ${componentName} } from 'stylist-svelte/components/${category}';

  let props = ${propsStr};
${lt}/script${gt}

${componentTag}`;
  };

  $effect(() => {
    exampleCode = getExampleCode(currentStory, componentProps);
  });
</script>

<div class="h-screen flex flex-col">
  <!-- Toolbar с дополнительными функциями -->
  <Toolbar 
    category={currentStory?.category || ''} 
    componentName={currentStory?.componentName || ''} 
  />
  
  <!-- Основной контент с Canvas, ControlPanel, CodeViewer и другими панелями -->
  <div class="flex-1 flex overflow-hidden">
    {#if currentStory}
      <div class="flex-1 flex flex-col">
        <div class="flex-1 p-6 overflow-auto">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
            <Canvas 
              component={currentStory.component}
              props={componentProps}
            />
            <ABTesting 
              componentName={currentStory.componentName} 
            />
            <A11yPanel 
              componentName={currentStory.componentName} 
            />
            <DesignTokens />
            <CodeViewer 
              code={exampleCode}
              language="svelte"
            />
            <CommentsPanel 
              storyId={storyId || ''} 
              componentName={currentStory.componentName} 
            />
          </div>
        </div>
      </div>
      
      <ControlPanel
        props={componentProps}
        onChange={handlePropsChange}
      />
    {:else}
      <div class="flex-1 flex items-center justify-center p-6">
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-4">История не найдена</h1>
          <p class="text-gray-600 dark:text-gray-400">Выберите историю из списка слева</p>
          <a href="/" class="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Вернуться к списку</a>
        </div>
      </div>
    {/if}
  </div>
</div>