<script lang="ts">
  import { onMount } from 'svelte';
  import { playgroundStore } from '../../state/playground.svelte';
  import { generateCode } from '$stylist/utils/code-preview';

  const {
    code = '',
    componentName = '',
    props = {},
    language = 'svelte',
    theme = 'github-light'
  } = $props<{
    code?: string;
    componentName?: string;
    props?: Record<string, any>;
    language?: string;
    theme?: 'light' | 'dark' | 'github-light' | 'github-dark';
  }>();

  let highlightedCode = $state('');
  let isLoading = $state(true);
  let currentTheme = $state(theme);
  let darkMode = $state(false);
  let highlightSequence = 0;
  let shikiLoader: Promise<typeof import('shiki')> | null = null;

  const generatedCode = $derived.by(() => {
    if (componentName && Object.keys(props).length > 0) {
      return generateCode({ componentName, props });
    }
    return code;
  });

  const currentLanguage = $derived.by(() => (componentName ? 'svelte' : language));
  
  $effect(() => {
    const codeSnippet = generatedCode;
    const lang = currentLanguage;
    const activeTheme = currentTheme;
    const requestId = ++highlightSequence;

    highlightCode(codeSnippet, lang, activeTheme, requestId);
  });
  
  $effect(() => {
    currentTheme = darkMode ? 'github-dark' : 'github-light';
  });
  
  const loadShiki = () => {
    if (!shikiLoader) {
      shikiLoader = import('shiki');
    }
    return shikiLoader;
  };

  async function highlightCode(codeToHighlight: string, currentLanguage: string, currentTheme: string, requestId: number) {
    if (!codeToHighlight) {
      highlightedCode = '';
      isLoading = false;
      return;
    }

    try {
      isLoading = true;
      const { codeToHtml } = await loadShiki();
      const highlighted = await codeToHtml(codeToHighlight, {
        lang: currentLanguage,
        theme: currentTheme
      });

      if (requestId === highlightSequence) {
        highlightedCode = highlighted;
      }
    } catch (error) {
      if (requestId === highlightSequence) {
        console.error('error1', error);
        highlightedCode = `<pre><code>${codeToHighlight}</code></pre>`;
      }
    } finally {
      if (requestId === highlightSequence) {
        isLoading = false;
      }
    }
  }
  

  const copyCode = async () => {
    try {
      const codeToCopy = generatedCode;
      await navigator.clipboard.writeText(codeToCopy);
      playgroundStore.success('Код скопирован');
    } catch (err) {
      console.error('error2', err);
      playgroundStore.error('Не удалось скопировать код');
    }
  };

  const downloadCode = () => {
    try {
      const codeToDownload = generatedCode;
      const blob = new Blob([codeToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Svelte file extension
      a.download = `${componentName || 'component'}.svelte`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playgroundStore.success('Файл загружен');
    } catch (err) {
      console.error('error4', err);
      playgroundStore.error('Не удалось загрузить файл');
    }
  };
  
  onMount(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      darkMode = true;
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      darkMode = e.matches;
    });
  });
</script>

<div class="code-viewer border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
  <!-- Header with Svelte badge -->
  <div class="code-tabs flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2">
    <div class="flex items-center gap-2">
      <span class="px-2 py-1 text-xs font-semibold rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
        Svelte 5
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        Component Code
      </span>
    </div>
  </div>
  
  <!-- Панель инструментов -->
  <div class="code-toolbar flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="text-xs text-gray-500 dark:text-gray-400">
      {currentLanguage} • {generatedCode.split('\n').length} строк
      {#if componentName}
        • Динамическая генерация
      {/if}
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
