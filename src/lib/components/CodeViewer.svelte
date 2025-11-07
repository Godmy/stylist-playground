<script lang="ts">
  import { codeToHtml } from 'shiki';
  import { onMount, tick } from 'svelte';
  
  // Параметры компонента с использованием $props()
  const { 
    code = '', 
    language = 'svelte', 
    theme = 'github-light' 
  } = $props<{ 
    code?: string; 
    language?: string; 
    theme?: 'light' | 'dark' | 'github-light' | 'github-dark'; 
  }>();
  
  // Внутренние состояния
  let highlightedCode = $state('');
  let isLoading = $state(true);
  let currentTheme = $state(theme);
  let codeFormat = $state('svelte');
  let darkMode = $state(false);
  
  // Обновление при изменении темы
  $effect(() => {
    if (currentTheme) {
      highlightCode();
    }
  });
  
  // Обновление при изменении кода
  $effect(() => {
    if (code && language) {
      highlightCode();
    }
  });
  
  // Установка темы в зависимости от режима
  $effect(() => {
    currentTheme = darkMode ? 'github-dark' : 'github-light';
  });
  
  // Подсветка кода
  async function highlightCode() {
    if (!code) {
      highlightedCode = '';
      isLoading = false;
      return;
    }
    
    try {
      isLoading = true;
      highlightedCode = await codeToHtml(code, {
        lang: language,
        theme: currentTheme
      });
    } catch (error) {
      console.error('Ошибка подсветки кода:', error);
      highlightedCode = `<pre><code>${code}</code></pre>`;
    } finally {
      isLoading = false;
    }
  }
  
  // Копирование кода
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Здесь можно добавить уведомление о копировании
      console.log('Код скопирован в буфер обмена');
    } catch (err) {
      console.error('Не удалось скопировать код:', err);
    }
  };
  
  // Скачивание файла
  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  onMount(() => {
    // Определяем начальную тему в зависимости от системы
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      darkMode = true;
    }
    
    // Подписываемся на изменения темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      darkMode = e.matches;
    });
    
    // Подсветка кода при монтировании
    highlightCode();
  });
</script>

<div class="code-viewer border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
  <!-- Вкладки для разных форматов -->
  <div class="code-tabs flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
    <button 
      class="px-4 py-2 text-sm font-medium {codeFormat === 'svelte' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}"
      onclick={() => codeFormat = 'svelte'}
    >
      Svelte
    </button>
    <button 
      class="px-4 py-2 text-sm font-medium {codeFormat === 'jsx' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}"
      onclick={() => codeFormat = 'jsx'}
    >
      React (JSX)
    </button>
    <button 
      class="px-4 py-2 text-sm font-medium {codeFormat === 'vue' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}"
      onclick={() => codeFormat = 'vue'}
    >
      Vue
    </button>
  </div>
  
  <!-- Панель инструментов -->
  <div class="code-toolbar flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="text-xs text-gray-500 dark:text-gray-400">
      {language} • {code.split('\n').length} строк
    </div>
    <div class="flex space-x-2">
      <button
        onclick={copyCode}
        class="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
        title="Копировать код"
      >
        Копировать
      </button>
      <button
        onclick={downloadCode}
        class="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
        title="Скачать файл"
      >
        Скачать
      </button>
    </div>
  </div>
  
  <!-- Контейнер для подсвеченного кода -->
  <div class="code-content overflow-auto max-h-96">
    {#if isLoading}
      <div class="p-4 text-center text-gray-500 dark:text-gray-400">
        Загрузка подсветки кода...
      </div>
    {:else if highlightedCode}
      {@html highlightedCode}
    {:else}
      <div class="p-4 text-gray-500 dark:text-gray-400">
        Нет кода для отображения
      </div>
    {/if}
  </div>
</div>