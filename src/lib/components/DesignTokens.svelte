<script lang="ts">
  // Тип для дизайн токена
  type DesignToken = {
    name: string;
    value: string;
    category: string;
    description?: string;
  };
  
  // Параметры компонента с использованием $props()
  // $props() не нужен для DesignTokens, так как компонент не принимает пропсы
  
  // Состояния
  let tokens = $state<DesignToken[]>([
    {
      name: '--color-primary',
      value: '#6366f1',
      category: 'Colors',
      description: 'Основной цвет акцента'
    },
    {
      name: '--color-primary-dark',
      value: '#4f46e5',
      category: 'Colors',
      description: 'Темная версия основного цвета'
    },
    {
      name: '--color-secondary',
      value: '#8b5cf6',
      category: 'Colors',
      description: 'Вторичный цвет акцента'
    },
    {
      name: '--spacing-sm',
      value: '0.5rem',
      category: 'Spacing',
      description: 'Маленький отступ'
    },
    {
      name: '--spacing-md',
      value: '1rem',
      category: 'Spacing',
      description: 'Средний отступ'
    },
    {
      name: '--spacing-lg',
      value: '1.5rem',
      category: 'Spacing',
      description: 'Большой отступ'
    },
    {
      name: '--radius-sm',
      value: '0.25rem',
      category: 'Radius',
      description: 'Маленький радиус скругления'
    },
    {
      name: '--radius-md',
      value: '0.5rem',
      category: 'Radius',
      description: 'Средний радиус скругления'
    },
    {
      name: '--radius-lg',
      value: '0.75rem',
      category: 'Radius',
      description: 'Большой радиус скругления'
    },
    {
      name: '--font-size-sm',
      value: '0.875rem',
      category: 'Typography',
      description: 'Маленький размер шрифта'
    },
    {
      name: '--font-size-base',
      value: '1rem',
      category: 'Typography',
      description: 'Базовый размер шрифта'
    },
    {
      name: '--font-size-lg',
      value: '1.125rem',
      category: 'Typography',
      description: 'Большой размер шрифта'
    }
  ]);
  
  let selectedCategory = $state<string>('Все');
  
  // Получаем уникальные категории
  const categories = $derived(['Все', ...new Set(tokens.map(token => token.category))]);
  
  // Фильтруем токены по категории
  const filteredTokens = $derived(() => {
    if (selectedCategory === 'Все') return tokens;
    return tokens.filter(token => token.category === selectedCategory);
  });
  
  // Форматирование значения в зависимости от типа
  const formatTokenValue = (value: string) => {
    return value;
  };
</script>

<div class="design-tokens-panel border-t border-gray-200 dark:border-gray-700 pt-4">
  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Design Tokens</h3>
  
  <!-- Фильтр по категориям -->
  <div class="mb-4">
    <select 
      bind:value={selectedCategory}
      class="w-full md:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
    >
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>
  
  <!-- Список токенов -->
  <div class="token-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each filteredTokens() as token}
      <div class="token bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="token-header flex justify-between items-start mb-2">
          <div>
            <div class="token-name font-mono text-sm text-indigo-600 dark:text-indigo-400 break-all">
              {token.name}
            </div>
            {#if token.description}
              <div class="token-description text-xs text-gray-500 dark:text-gray-400 mt-1">
                {token.description}
              </div>
            {/if}
          </div>
          <div class="token-swatch w-6 h-6 rounded border border-gray-300 dark:border-gray-600" 
               style="background: {token.value}" 
               title={token.value}>
          </div>
        </div>
        <div class="token-value font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
          {formatTokenValue(token.value)}
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Краткая статистика -->
  <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
    Показано {filteredTokens.length} из {tokens.length} токенов
  </div>
</div>