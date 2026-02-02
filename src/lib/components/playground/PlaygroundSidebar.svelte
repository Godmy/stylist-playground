<script lang="ts">
  import { Layers, Sliders, FileText, Code, Accessibility, X } from 'lucide-svelte';
  import { playgroundStore } from '../stores/playground.svelte';
  import type { Snippet } from 'svelte';

  type SidebarTab = 'variants' | 'props' | 'docs' | 'code' | 'a11y';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  const tabs: { id: SidebarTab; icon: any; label: string }[] = [
    { id: 'variants', icon: Layers, label: 'Variants' },
    { id: 'props', icon: Sliders, label: 'Props' },
    { id: 'code', icon: Code, label: 'Code' }
  ];
</script>

{#if playgroundStore.state.sidebarOpen}
  <div class="sidebar-container w-64 border-r border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 flex flex-col">
    <!-- Tabs - compact -->
    <div class="flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1">
      <div class="flex-1 flex gap-1">
        {#each tabs as tab}
          <button
            onclick={() => playgroundStore.setSidebarTab(tab.id)}
            class={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${(playgroundStore.state.sidebarTab === tab.id) ? 'bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700'}`}
          >
            {#if tab.icon}
              {@const Icon = tab.icon}
              <Icon class="w-3.5 h-3.5" />
            {/if}
            <span class="text-xs font-medium">{tab.label}</span>
          </button>
        {/each}
      </div>

      <!-- Close button -->
      <button
        onclick={() => playgroundStore.toggleSidebar()}
        class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Close sidebar"
      >
        <X class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
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
  .sidebar-container {
    animation: slide-in-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slide-in-left {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .border-b-3 {
    border-bottom-width: 3px;
  }
</style>
