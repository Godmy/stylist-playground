<script lang="ts">
  import { playgroundStore } from '../stores/playground.svelte';
  import type { ControlConfig, ControlGroup } from '../types';
  import { RotateCcw, Search, ChevronDown, ChevronRight, Type, Hash, Check, Braces, Palette } from 'lucide-svelte';

  // Get current story and its controls
  const currentStory = $derived(playgroundStore.getCurrentStory());
  const controls = $derived(currentStory?.controls || []);
  const controlValues = $derived(playgroundStore.controlValues);

  // Search state
  let searchQuery = $state('');

  // Collapsed groups state
  let collapsedGroups = $state<Set<string>>(new Set());

  // Group controls by their group property
  const groupedControls = $derived.by(() => {
    const groups = new Map<ControlGroup, ControlConfig[]>();

    controls.forEach((control: ControlConfig) => {
      const group = control.group || 'Other';
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(control);
    });

    // Sort groups in specific order
    const groupOrder: ControlGroup[] = ['Layout', 'Style', 'Behavior', 'Content', 'Advanced', 'Other'];
    const sortedGroups = new Map<ControlGroup, ControlConfig[]>();

    groupOrder.forEach((groupName) => {
      if (groups.has(groupName)) {
        sortedGroups.set(groupName, groups.get(groupName)!);
      }
    });

    return sortedGroups;
  });

  // Filter controls by search query
  const filteredControls = $derived.by(() => {
    if (!searchQuery.trim()) {
      return groupedControls;
    }

    const filtered = new Map<ControlGroup, ControlConfig[]>();
    const query = searchQuery.toLowerCase();

    groupedControls.forEach((controlsList, group) => {
      const matchedControls = controlsList.filter((control) =>
        control.name.toLowerCase().includes(query) ||
        control.description?.toLowerCase().includes(query)
      );

      if (matchedControls.length > 0) {
        filtered.set(group, matchedControls);
      }
    });

    return filtered;
  });

  function handleControlChange(name: string, value: any) {
    playgroundStore.updateControl(name, value);
  }

  function resetToDefaults() {
    const story = playgroundStore.getCurrentStory();
    if (story?.controls) {
      story.controls.forEach((control: ControlConfig) => {
        playgroundStore.updateControl(control.name, control.defaultValue);
      });
    }
  }

  function resetControl(control: ControlConfig) {
    playgroundStore.updateControl(control.name, control.defaultValue);
  }

  function toggleGroup(group: string) {
    if (collapsedGroups.has(group)) {
      collapsedGroups.delete(group);
    } else {
      collapsedGroups.add(group);
    }
    collapsedGroups = new Set(collapsedGroups);
  }

  // Icon for each control type
  function getTypeIcon(type: string) {
    switch (type) {
      case 'text':
        return Type;
      case 'number':
      case 'range':
        return Hash;
      case 'boolean':
        return Check;
      case 'object':
      case 'array':
        return Braces;
      case 'color':
        return Palette;
      default:
        return Type;
    }
  }

  // Color for each control type
  function getTypeColor(type: string) {
    switch (type) {
      case 'text':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'number':
      case 'range':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'boolean':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'object':
      case 'array':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'color':
        return 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  }
</script>

<div class="controls-panel p-6 h-full overflow-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
  <!-- Header with reset button -->
  <div class="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
    <h3 class="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
      Controls
    </h3>
    {#if controls.length > 0}
      <button
        onclick={resetToDefaults}
        class="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 text-purple-700 dark:text-purple-300 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
        title="Reset all to defaults"
      >
        <RotateCcw class="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
        Reset All
      </button>
    {/if}
  </div>

  {#if controls.length === 0}
    <div class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
        No controls available for this component
      </p>
    </div>
  {:else}
    <!-- Search bar -->
    <div class="mb-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search props..."
          class="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <!-- Grouped controls -->
    {#if filteredControls.size === 0}
      <div class="text-center py-8">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          No controls match "{searchQuery}"
        </p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each [...filteredControls.entries()] as [group, groupControls]}
          <div class="group-container bg-white dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <!-- Group header -->
            <button
              onclick={() => toggleGroup(group)}
              class="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all"
            >
              <div class="flex items-center gap-2">
                {#if collapsedGroups.has(group)}
                  <ChevronRight class="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform" />
                {:else}
                  <ChevronDown class="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform" />
                {/if}
                <span class="text-sm font-bold text-gray-900 dark:text-white">{group}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {groupControls.length}
                </span>
              </div>
            </button>

            <!-- Group controls -->
            {#if !collapsedGroups.has(group)}
              <div class="p-4 space-y-4">
                {#each groupControls as control}
                  {@const TypeIcon = getTypeIcon(control.type)}
                  <div class="control-item p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                    <!-- Control header -->
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center justify-center w-6 h-6 rounded {getTypeColor(control.type)}">
                          <TypeIcon class="w-3.5 h-3.5" />
                        </div>
                        <label class="text-xs font-semibold text-gray-900 dark:text-white" for={control.name}>
                          {control.name}
                        </label>
                      </div>
                      <button
                        onclick={() => resetControl(control)}
                        class="group p-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                        title="Reset to default"
                      >
                        <RotateCcw class="w-3 h-3 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all group-hover:rotate-180" />
                      </button>
                    </div>

                    {#if control.description}
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {control.description}
                      </p>
                    {/if}

          {#if control.type === 'text'}
            <input
              type="text"
              id={control.name}
              value={controlValues[control.name] ?? control.defaultValue ?? ''}
              oninput={(e) => handleControlChange(control.name, e.currentTarget.value)}
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={String(control.defaultValue || '')}
            />

          {:else if control.type === 'number' || control.type === 'range'}
            <div class="space-y-2">
              <input
                type="range"
                id={control.name}
                value={controlValues[control.name] ?? control.defaultValue ?? 0}
                min={control.min ?? 0}
                max={control.max ?? 100}
                step={control.step ?? 1}
                oninput={(e) => handleControlChange(control.name, Number(e.currentTarget.value))}
                class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{control.min ?? 0}</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">
                  {controlValues[control.name] ?? control.defaultValue ?? 0}
                </span>
                <span>{control.max ?? 100}</span>
              </div>
            </div>

          {:else if control.type === 'boolean'}
            <label class="flex items-center gap-2 cursor-pointer" for={control.name}>
              <input
                type="checkbox"
                id={control.name}
                checked={controlValues[control.name] ?? control.defaultValue ?? false}
                onchange={(e) => handleControlChange(control.name, e.currentTarget.checked)}
                class="w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 cursor-pointer"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {controlValues[control.name] ?? control.defaultValue ? 'Enabled' : 'Disabled'}
              </span>
            </label>

          {:else if control.type === 'select'}
            <select
              id={control.name}
              value={controlValues[control.name] ?? control.defaultValue}
              onchange={(e) => handleControlChange(control.name, e.currentTarget.value)}
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {#if control.options}
                {#each control.options as option}
                  <option value={option}>
                    {option}
                  </option>
                {/each}
              {/if}
            </select>

          {:else if control.type === 'color'}
            <div class="flex items-center gap-2">
              <input
                type="color"
                id={control.name}
                value={controlValues[control.name] ?? control.defaultValue ?? '#000000'}
                oninput={(e) => handleControlChange(control.name, e.currentTarget.value)}
                class="w-12 h-10 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={controlValues[control.name] ?? control.defaultValue ?? '#000000'}
                oninput={(e) => handleControlChange(control.name, e.currentTarget.value)}
                class="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="#000000"
              />
            </div>

          {:else if control.type === 'date'}
            <input
              type="date"
              id={control.name}
              value={controlValues[control.name] ?? control.defaultValue ?? ''}
              oninput={(e) => handleControlChange(control.name, e.currentTarget.value)}
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          {:else if control.type === 'object'}
            <textarea
              value={JSON.stringify(controlValues[control.name] ?? control.defaultValue ?? {}, null, 2)}
              oninput={(e) => {
                try {
                  const parsed = JSON.parse(e.currentTarget.value);
                  handleControlChange(control.name, parsed);
                } catch {
                  // Invalid JSON, don't update
                }
              }}
              rows="4"
              class="w-full px-3 py-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="{'{}'}"
            ></textarea>

          {:else if control.type === 'array'}
            <textarea
              value={JSON.stringify(controlValues[control.name] ?? control.defaultValue ?? [], null, 2)}
              oninput={(e) => {
                try {
                  const parsed = JSON.parse(e.currentTarget.value);
                  if (Array.isArray(parsed)) {
                    handleControlChange(control.name, parsed);
                  }
                } catch {
                  // Invalid JSON, don't update
                }
              }}
              rows="3"
              class="w-full px-3 py-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="{'[]'}"
            ></textarea>

                    {:else}
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Control type "{control.type}" not yet supported
                      </p>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  /* Better range slider styling */
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    background: linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246));
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    background: linear-gradient(135deg, rgb(79 70 229), rgb(124 58 237));
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  }

  input[type="range"]::-moz-range-thumb {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    background: linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246));
    cursor: pointer;
    transition: all 0.2s;
    border: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  input[type="range"]::-moz-range-thumb:hover {
    background: linear-gradient(135deg, rgb(79 70 229), rgb(124 58 237));
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  }

  .control-item {
    animation: fade-in 0.2s ease-out;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .group-container {
    animation: slide-in 0.3s ease-out;
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
