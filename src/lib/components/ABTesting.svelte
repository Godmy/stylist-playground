<script lang="ts">
  import type { ComponentType } from 'svelte';
  
  // Тип для варианта компонента
  type Variant = {
    id: string;
    name: string;
    component: ComponentType | null;
    props: Record<string, any>;
    enabled: boolean;
  };
  
  // Параметры компонента с использованием $props()
  const { 
    componentName = '', 
    variants = [
      {
        id: 'a',
        name: 'Вариант A',
        component: null,
        props: {},
        enabled: true
      },
      {
        id: 'b',
        name: 'Вариант B',
        component: null,
        props: {},
        enabled: false
      }
    ] 
  } = $props<{ 
    componentName?: string; 
    variants?: Variant[]; 
  }>();
  
  // Состояния
  let localVariants = $state<Variant[]>(JSON.parse(JSON.stringify(variants)));
  
  // Обновляем локальные варианты при изменении пропсов
  $effect(() => {
    if (variants) {
      localVariants = JSON.parse(JSON.stringify(variants));
    }
  });
  
  // Переключение варианта
  const toggleVariant = (id: string) => {
    const variant = localVariants.find(v => v.id === id);
    if (variant) {
      variant.enabled = !variant.enabled;
    }
  };
</script>

<div class="ab-testing-panel border-t border-gray-200 dark:border-gray-700 pt-4">
  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Сравнение вариантов</h3>
  
  <div class="variant-selector flex space-x-4 mb-4">
    {#each localVariants as variant}
      <label class="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={variant.enabled}
          onchange={() => toggleVariant(variant.id)}
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <span class="text-gray-700 dark:text-gray-300">{variant.name}</span>
      </label>
    {/each}
  </div>
  
  <div class="comparison-view grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each localVariants.filter(v => v.enabled) as variant}
      <div class="variant bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 class="text-md font-medium text-gray-800 dark:text-white mb-3">{variant.name}</h4>
        <div class="variant-content min-h-[100px] flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
          {#if variant.component}
            <svelte:component this={variant.component} {...variant.props} />
          {:else}
            <p class="text-gray-500 dark:text-gray-400">Компонент не доступен</p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  
  {#if localVariants.filter(v => v.enabled).length < 2}
    <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
      Выберите как минимум 2 варианта для сравнения
    </div>
  {/if}
</div>