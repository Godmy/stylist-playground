<script lang="ts">
  import { playgroundStore } from '../stores/playground.svelte';
  import type { HistoryEntry } from '../utils/history';
  import { Clock, TrendingUp, Trash2, X } from 'lucide-svelte';

  let recentHistory = $state<HistoryEntry[]>([]);
  let mostVisited = $state<HistoryEntry[]>([]);
  let stats = $state<any>({});

  // Reactive updates
  $effect(() => {
    // Re-fetch history whenever current story changes (triggers recomputation)
    playgroundStore.state.currentStoryId;

    recentHistory = playgroundStore.getRecentHistory(10);
    mostVisited = playgroundStore.getMostVisited(5);
    stats = playgroundStore.getHistoryStats();
  });

  function handleNavigate(storyId: string) {
    playgroundStore.navigateToHistory(storyId);
  }

  function handleRemove(storyId: string, event: Event) {
    event.stopPropagation();
    playgroundStore.removeFromHistory(storyId);

    // Refresh
    recentHistory = playgroundStore.getRecentHistory(10);
    mostVisited = playgroundStore.getMostVisited(5);
    stats = playgroundStore.getHistoryStats();
  }

  function handleClearAll() {
    if (confirm('Clear all history?')) {
      playgroundStore.clearHistory();

      // Refresh
      recentHistory = [];
      mostVisited = [];
      stats = playgroundStore.getHistoryStats();
    }
  }

  function formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  function getStoryTitle(storyId: string): string {
    const story = playgroundStore.stories.get(storyId);
    return story?.title || storyId.split('-').pop() || storyId;
  }

  function getStoryCategory(storyId: string): string {
    const story = playgroundStore.stories.get(storyId);
    return story?.category || 'Component';
  }

  function isCurrentStory(storyId: string): boolean {
    return playgroundStore.state.currentStoryId === storyId;
  }
</script>

<div class="history-panel space-y-6 p-4">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Recent History</h3>
    {#if recentHistory.length > 0}
      <button
        onclick={handleClearAll}
        class="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
      >
        Clear All
      </button>
    {/if}
  </div>

  <!-- Statistics Cards -->
  {#if stats.totalVisits > 0}
    <div class="grid grid-cols-2 gap-3">
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-900/50"
      >
        <div class="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Total Visits</div>
        <div class="text-2xl font-bold text-blue-900 dark:text-blue-100">
          {stats.totalVisits}
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-lg p-3 border border-purple-200 dark:border-purple-900/50"
      >
        <div class="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
          Components
        </div>
        <div class="text-2xl font-bold text-purple-900 dark:text-purple-100">
          {stats.uniqueComponents}
        </div>
      </div>
    </div>
  {/if}

  <!-- Most Visited -->
  {#if mostVisited.length > 0}
    <div class="space-y-2">
      <h4 class="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
        <TrendingUp class="w-3 h-3" />
        Most Visited
      </h4>

      <div class="space-y-1">
        {#each mostVisited as entry (entry.storyId)}
          <button
            onclick={() => handleNavigate(entry.storyId)}
            class="group w-full flex items-center gap-2 rounded-lg border p-2 transition-all text-left {isCurrentStory(
              entry.storyId
            )
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
              : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}"
          >
            <div class="flex-1 min-w-0">
              <div class="text-xs font-medium text-gray-900 dark:text-white truncate">
                {getStoryTitle(entry.storyId)}
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {getStoryCategory(entry.storyId)}
                </span>
                <span>{entry.visitCount} {entry.visitCount === 1 ? 'visit' : 'visits'}</span>
              </div>
            </div>

            <div
              onclick={(e) => handleRemove(entry.storyId, e)}
              class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Remove from history"
              role="button"
              tabindex="0"
              onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRemove(entry.storyId, e)}
            >
              <X class="w-3 h-3" />
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Recent History -->
  {#if recentHistory.length > 0}
    <div class="space-y-2">
      <h4 class="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
        <Clock class="w-3 h-3" />
        Recent
      </h4>

      <div class="space-y-1">
        {#each recentHistory as entry (entry.storyId)}
          <button
            onclick={() => handleNavigate(entry.storyId)}
            class="group w-full flex items-center gap-2 rounded-lg border p-2 transition-all text-left {isCurrentStory(
              entry.storyId
            )
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
              : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}"
          >
            <div class="flex-1 min-w-0">
              <div class="text-xs font-medium text-gray-900 dark:text-white truncate">
                {getStoryTitle(entry.storyId)}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {formatTimestamp(entry.timestamp)}
              </div>
            </div>

            <div
              onclick={(e) => handleRemove(entry.storyId, e)}
              class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Remove from history"
              role="button"
              tabindex="0"
              onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRemove(entry.storyId, e)}
            >
              <X class="w-3 h-3" />
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Empty State -->
  {#if recentHistory.length === 0}
    <div
      class="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-8 text-center"
    >
      <Clock class="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">No history yet</p>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
        Visit components to build your history
      </p>
    </div>
  {/if}

  <!-- Pro Tips -->
  <div
    class="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3"
  >
    <p class="text-xs text-blue-900 dark:text-blue-300 font-medium mb-1">Pro Tips</p>
    <ul class="text-xs text-blue-800 dark:text-blue-400 space-y-1">
      <li>📊 Track your most-used components</li>
      <li>⏱️ Quick access to recently viewed</li>
      <li>🧹 Clear history anytime</li>
    </ul>
  </div>
</div>
