<script lang="ts">
  import { Sliders, Code, ChevronDown, ChevronUp, Zap, Layers, Download, Keyboard, Star } from 'lucide-svelte';
  import { playgroundStore } from '../stores/playground.svelte';
  import type { Snippet } from 'svelte';
  import type { BottomTab } from '../types';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  const tabs: { id: BottomTab; icon: any; label: string }[] = [
    { id: 'controls', icon: Sliders, label: 'Controls' },
    { id: 'code', icon: Code, label: 'Code' },
    { id: 'variants', icon: Layers, label: 'Variants' }
  ];
</script>

{#if playgroundStore.uiState.bottomPanelOpen}
  <div class="bottom-panel-expanded h-64 border-t border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 flex flex-col">
    <!-- Tabs - compact -->
    <div class="flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div class="flex-1 flex gap-1 p-1">
        {#each tabs as tab}
          <button
            onclick={() => playgroundStore.setBottomTab(tab.id)}
            class={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${(playgroundStore.state.bottomTab === tab.id) ? 'bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700'}`}
          >
            {#if tab.icon}
              {@const Icon = tab.icon}
              <Icon class="w-4 h-4" />
            {/if}
            <span class="text-sm font-medium">{tab.label}</span>
          </button>
        {/each}
      </div>

      <!-- Toggle button -->
      <button
        onclick={() => playgroundStore.toggleBottomPanel()}
        class="p-2 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Collapse panel"
      >
        <ChevronDown class="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      {#if children}
        {@render children()}
      {/if}
    </div>
  </div>
{/if}

<style>
  .bottom-panel-expanded {
    animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .bottom-panel-collapsed {
    animation: slide-down 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .border-b-3 {
    border-bottom-width: 3px;
  }
</style>
