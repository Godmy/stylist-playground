<script lang="ts">
  // Определяем типы для пропсов с использованием $props()
  const { 
    props = {}, 
    onChange = () => {} 
  } = $props<{ 
    props?: Record<string, any>; 
    onChange?: (newProps: Record<string, any>) => void; 
  }>();
  
  // Контролируемое состояние пропсов
  let localProps = $state({ ...props });
  
  // Группы контролов
  let activeGroup = $state('Все');
  
  // Типизированные пропсы для отображения
  let propControls = $state<{ [key: string]: { value: any; type: string; group: string } }>({});
  
  // Обновляем контролы при изменении пропсов
  $effect(() => {
    if (props) {
      for (const key in props) {
        if (!propControls[key]) {
          propControls[key] = {
            value: props[key],
            type: typeof props[key],
            group: 'Содержимое' // по умолчанию
          };
        }
      }
    }
  });
  
  // Обработчик изменения значения
  const handleChange = (key: string, value: any) => {
    localProps[key] = value;
    propControls[key].value = value;
    onChange(localProps);
  };
  
  type ControlGroup = { name: string; control: any };

  // Группировка контролов
  const controlGroups = $derived(() => {
    const groups: { [key: string]: ControlGroup[] } = {
      'Все': [],
      'Внешний вид': [],
      'Состояние': [],
      'Содержимое': []
    };
    
    for (const key in propControls) {
      const control = propControls[key];
      const group = control.group;
      
      if (!groups[group]) {
        groups[group] = [];
      }
      
      groups[group].push({ name: key, control });
      groups['Все'].push({ name: key, control });
    }
    
    return groups;
  });
  
  // Сбросить все значения
  const resetControls = () => {
    for (const key in props) {
      localProps[key] = props[key];
      propControls[key].value = props[key];
    }
    onChange(localProps);
  };
  
  // Предустановки (пример)
  const presets = [
    { name: 'Primary CTA', values: { variant: 'primary', size: 'md' } },
    { name: 'Danger Button', values: { variant: 'danger', size: 'lg' } },
    { name: 'Ghost Subtle', values: { variant: 'ghost', size: 'sm' } }
  ];
  
  const applyPreset = (presetValues: Record<string, any>) => {
    for (const key in presetValues) {
      if (localProps.hasOwnProperty(key)) {
        localProps[key] = presetValues[key];
        propControls[key].value = presetValues[key];
      }
    }
    onChange(localProps);
  };
</script>

<div class="control-panel bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-80 flex flex-col">
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Controls</h3>
      <button 
        onclick={resetControls}
        class="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
      >
        ↺ Сбросить
      </button>
    </div>
    
    {#if Object.keys(controlGroups()['Все']).length > 0}
      <select 
        bind:value={activeGroup}
        class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm mb-2"
      >
        {#each Object.keys(controlGroups) as group}
          <option value={group}>{group}</option>
        {/each}
      </select>
    {/if}
    
    {#if Object.keys(controlGroups).length > 1}
      <select 
        class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        onchange={(e: Event) => {
          const target = e.target as HTMLSelectElement;
          if (target && !isNaN(parseInt(target.value))) {
            applyPreset(presets[parseInt(target.value)].values);
          }
        }}
      >
        <option value="">Выберите пресет...</option>
        {#each presets as preset, i}
          <option value={i}>{preset.name}</option>
        {/each}
      </select>
    {/if}
  </div>
  
  <div class="flex-1 overflow-y-auto p-4">
    {#if controlGroups()[activeGroup] && controlGroups()[activeGroup].length > 0}
      {#each controlGroups()[activeGroup] as item}
        <div class="mb-4 last:mb-0">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {item.name}
          </label>
          
          {#if typeof item.control.value === 'boolean'}
            <div class="flex items-center">
              <input
                type="checkbox"
                bind:checked={localProps[item.name]}
                onchange={() => handleChange(item.name, localProps[item.name])}
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {localProps[item.name] ? 'Включено' : 'Выключено'}
              </span>
            </div>
          {:else if typeof item.control.value === 'number'}
            <input
              type="number"
              bind:value={localProps[item.name]}
              oninput={() => handleChange(item.name, Number(localProps[item.name]))}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          {:else if typeof item.control.value === 'string' && ['select', 'radio'].includes(item.control.type)}
            <!-- Для строк, которые могут быть выбором -->
            <input
              type="text"
              bind:value={localProps[item.name]}
              oninput={() => handleChange(item.name, localProps[item.name])}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          {:else if typeof item.control.value === 'string'}
            <input
              type="text"
              bind:value={localProps[item.name]}
              oninput={() => handleChange(item.name, localProps[item.name])}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          {:else}
            <input
              type="text"
              bind:value={localProps[item.name]}
              oninput={() => handleChange(item.name, localProps[item.name])}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Тип не поддерживается"
            />
          {/if}
        </div>
      {/each}
    {:else}
      <p class="text-gray-500 dark:text-gray-400 text-sm">Нет доступных контролов</p>
    {/if}
  </div>
</div>