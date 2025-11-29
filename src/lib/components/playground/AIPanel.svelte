<script lang="ts">
  import { ChevronRight, ChevronDown } from 'lucide-svelte';

  interface AIProvider {
    id: string;
    name: string;
    options: AIOption[];
  }

  interface AIOption {
    id: string;
    label: string;
    action?: () => void;
  }

  interface Props {
    selectedProviderId?: string | null;
    onOptionSelect?: (providerId: string, optionId: string) => void;
    onStartChat?: (providerId: 'gemini' | 'qwen' | 'claude' | 'codex') => void;
  }

  let { selectedProviderId = null, onOptionSelect, onStartChat }: Props = $props();

  const aiProviders: AIProvider[] = [
    {
      id: 'claude',
      name: 'CLAUDE',
      options: [
        { id: 'new-chat', label: 'Новый чат' },
        { id: 'version', label: 'Версия' },
        { id: 'settings', label: 'Настройки' }
      ]
    },
    {
      id: 'codex',
      name: 'CODEX',
      options: [
        { id: 'new-chat', label: 'Новый чат' },
        { id: 'version', label: 'Версия' },
        { id: 'settings', label: 'Настройки' }
      ]
    },
    {
      id: 'gemini',
      name: 'GEMINI',
      options: [
        { id: 'new-chat', label: 'Новый чат' },
        { id: 'version', label: 'Версия' },
        { id: 'settings', label: 'Настройки' }
      ]
    },
    {
      id: 'qwen',
      name: 'QWEN',
      options: [
        { id: 'new-chat', label: 'Новый чат' },
        { id: 'version', label: 'Версия' },
        { id: 'settings', label: 'Настройки' }
      ]
    }
  ];

  let expandedProviders = $state<Set<string>>(new Set(['claude']));

  function toggleProvider(providerId: string) {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(providerId)) {
      newExpanded.delete(providerId);
    } else {
      newExpanded.add(providerId);
    }
    expandedProviders = newExpanded;
  }

  function handleOptionClick(providerId: string, optionId: string) {
    onOptionSelect?.(providerId, optionId);

    // Special handling for new-chat option
    if (optionId === 'new-chat') {
      onStartChat?.(providerId as 'gemini' | 'qwen' | 'claude' | 'codex');
    }
  }
</script>

<style>
  .ai-panel-container {
    height: 100%;
    overflow-y: auto;
    background: white;
  }

  /* Dark mode styles */
  :global(.dark) .ai-panel-container {
    background: rgb(17 24 39);
  }

  .provider-header {
    transition: all 0.2s ease;
  }

  .provider-header:hover {
    background: rgb(249 250 251);
  }

  :global(.dark) .provider-header:hover {
    background: rgb(31 41 55);
  }

  .option-item {
    transition: all 0.15s ease;
  }

  .option-item:hover {
    background: rgb(243 244 246);
  }

  :global(.dark) .option-item:hover {
    background: rgb(55 65 81);
  }

  .option-item.selected {
    background: color-mix(in srgb, var(--playground-accent, #FF6B35) 10%, transparent);
    color: var(--playground-accent, #FF6B35);
  }
</style>

<div class="ai-panel-container">
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <h2 class="text-lg font-bold text-gray-900 dark:text-white">AI Assistants</h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Выберите AI-модель для работы
    </p>
  </div>

  <div class="p-2">
    {#each aiProviders as provider}
      <div class="mb-1">
        <!-- Provider header -->
        <button
          onclick={() => toggleProvider(provider.id)}
          class="provider-header w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left"
        >
          <div class="flex items-center gap-2">
            {#if expandedProviders.has(provider.id)}
              <ChevronDown class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            {:else}
              <ChevronRight class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            {/if}
            <span class="font-bold text-sm text-gray-900 dark:text-white">
              {provider.name}
            </span>
          </div>
        </button>

        <!-- Provider options -->
        {#if expandedProviders.has(provider.id)}
          <div class="ml-6 mt-1 space-y-0.5">
            {#each provider.options as option}
              <button
                onclick={() => handleOptionClick(provider.id, option.id)}
                class="option-item w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 {selectedProviderId === `${provider.id}-${option.id}` ? 'selected font-medium' : ''}"
              >
                {option.label}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
