<script lang="ts">
  import { playgroundStore } from '../stores/playground.svelte';
  import type { Preset } from '../utils/presets';
  import {
    Star,
    Trash2,
    Copy,
    Edit2,
    Check,
    X,
    Plus,
    Download,
    Upload
  } from 'lucide-svelte';

  // Reactive state that updates when store changes
  let currentStoryId = $derived(playgroundStore.state.currentStoryId);
  let presets = $state<Preset[]>([]);
  let favorites = $state<Preset[]>([]);

  // Update presets when current story changes
  $effect(() => {
    currentStoryId; // Track dependency
    presets = playgroundStore.getCurrentStoryPresets();
    favorites = playgroundStore.getFavoritePresets();
  });

  let showSaveDialog = $state(false);
  let newPresetName = $state('');
  let newPresetFavorite = $state(false);

  let editingId: string | null = $state(null);
  let editingName = $state('');

  function handleSavePreset() {
    if (!newPresetName.trim()) return;

    playgroundStore.saveAsPreset(newPresetName.trim(), newPresetFavorite);
    newPresetName = '';
    newPresetFavorite = false;
    showSaveDialog = false;

    // Refresh lists
    presets = playgroundStore.getCurrentStoryPresets();
    favorites = playgroundStore.getFavoritePresets();
  }

  function handleLoadPreset(id: string) {
    playgroundStore.loadPreset(id);
  }

  function handleToggleFavorite(id: string) {
    playgroundStore.togglePresetFavorite(id);
    // Refresh lists
    presets = playgroundStore.getCurrentStoryPresets();
    favorites = playgroundStore.getFavoritePresets();
  }

  function handleDelete(id: string) {
    if (confirm('Delete this preset?')) {
      playgroundStore.deletePreset(id);
      // Refresh lists
      presets = playgroundStore.getCurrentStoryPresets();
      favorites = playgroundStore.getFavoritePresets();
    }
  }

  function handleDuplicate(id: string) {
    playgroundStore.duplicatePreset(id);
    // Refresh lists
    presets = playgroundStore.getCurrentStoryPresets();
    favorites = playgroundStore.getFavoritePresets();
  }

  function startEditing(preset: Preset) {
    editingId = preset.id;
    editingName = preset.name;
  }

  function saveEditing() {
    if (editingId && editingName.trim()) {
      playgroundStore.renamePreset(editingId, editingName.trim());
      editingId = null;
      editingName = '';
      // Refresh lists
      presets = playgroundStore.getCurrentStoryPresets();
      favorites = playgroundStore.getFavoritePresets();
    }
  }

  function cancelEditing() {
    editingId = null;
    editingName = '';
  }

  function isActive(id: string): boolean {
    return playgroundStore.isPresetActive(id);
  }
</script>

<div class="presets-panel space-y-4 p-4">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Props Presets</h3>
    <button
      onclick={() => (showSaveDialog = !showSaveDialog)}
      class="flex items-center gap-1 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 transition-colors"
      title="Save current props as preset"
    >
      <Plus class="w-3 h-3" />
      Save Preset
    </button>
  </div>

  <!-- Save Dialog -->
  {#if showSaveDialog}
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
      <input
        type="text"
        bind:value={newPresetName}
        placeholder="Preset name..."
        class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400"
        onkeydown={(e) => e.key === 'Enter' && handleSavePreset()}
      />

      <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" bind:checked={newPresetFavorite} class="rounded" />
        Mark as favorite
      </label>

      <div class="flex gap-2">
        <button
          onclick={handleSavePreset}
          disabled={!newPresetName.trim()}
          class="flex-1 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
        <button
          onclick={() => (showSaveDialog = false)}
          class="rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}

  <!-- Favorites Section -->
  {#if favorites.length > 0}
    <div class="space-y-2">
      <h4 class="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
        <Star class="w-3 h-3 fill-yellow-400 text-yellow-400" />
        Favorites
      </h4>

      <div class="space-y-1">
        {#each favorites as preset (preset.id)}
          {#if preset.storyId === playgroundStore.state.currentStoryId}
            <div
              class="group flex items-center gap-2 rounded-lg border p-2 transition-all {isActive(
                preset.id
              )
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}"
            >
              {#if editingId === preset.id}
                <input
                  type="text"
                  bind:value={editingName}
                  class="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs"
                  onkeydown={(e) => e.key === 'Enter' && saveEditing()}
                />
                <button
                  onclick={saveEditing}
                  class="p-1 text-green-600 hover:text-green-700"
                  title="Save"
                >
                  <Check class="w-3 h-3" />
                </button>
                <button
                  onclick={cancelEditing}
                  class="p-1 text-red-600 hover:text-red-700"
                  title="Cancel"
                >
                  <X class="w-3 h-3" />
                </button>
              {:else}
                <button
                  onclick={() => handleLoadPreset(preset.id)}
                  class="flex-1 text-left text-xs font-medium text-gray-900 dark:text-white"
                >
                  {preset.name}
                  {#if preset.usageCount > 0}
                    <span class="ml-1 text-xs text-gray-500">({preset.usageCount})</span>
                  {/if}
                </button>

                <button
                  onclick={() => handleToggleFavorite(preset.id)}
                  class="p-1 text-yellow-400 hover:text-yellow-500"
                  title="Remove from favorites"
                >
                  <Star class="w-3 h-3 fill-current" />
                </button>

                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onclick={() => startEditing(preset)}
                    class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    title="Rename"
                  >
                    <Edit2 class="w-3 h-3" />
                  </button>
                  <button
                    onclick={() => handleDuplicate(preset.id)}
                    class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    title="Duplicate"
                  >
                    <Copy class="w-3 h-3" />
                  </button>
                  <button
                    onclick={() => handleDelete(preset.id)}
                    class="p-1 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 class="w-3 h-3" />
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <!-- Current Story Presets -->
  {#if presets.filter((p) => !p.favorite).length > 0}
    <div class="space-y-2">
      <h4 class="text-xs font-semibold text-gray-600 dark:text-gray-400">All Presets</h4>

      <div class="space-y-1">
        {#each presets.filter((p) => !p.favorite) as preset (preset.id)}
          <div
            class="group flex items-center gap-2 rounded-lg border p-2 transition-all {isActive(
              preset.id
            )
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}"
          >
            {#if editingId === preset.id}
              <input
                type="text"
                bind:value={editingName}
                class="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs"
                onkeydown={(e) => e.key === 'Enter' && saveEditing()}
              />
              <button
                onclick={saveEditing}
                class="p-1 text-green-600 hover:text-green-700"
                title="Save"
              >
                <Check class="w-3 h-3" />
              </button>
              <button
                onclick={cancelEditing}
                class="p-1 text-red-600 hover:text-red-700"
                title="Cancel"
              >
                <X class="w-3 h-3" />
              </button>
            {:else}
              <button
                onclick={() => handleLoadPreset(preset.id)}
                class="flex-1 text-left text-xs font-medium text-gray-900 dark:text-white"
              >
                {preset.name}
                {#if preset.usageCount > 0}
                  <span class="ml-1 text-xs text-gray-500">({preset.usageCount})</span>
                {/if}
              </button>

              <button
                onclick={() => handleToggleFavorite(preset.id)}
                class="p-1 text-gray-400 hover:text-yellow-500"
                title="Add to favorites"
              >
                <Star class="w-3 h-3" />
              </button>

              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onclick={() => startEditing(preset)}
                  class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  title="Rename"
                >
                  <Edit2 class="w-3 h-3" />
                </button>
                <button
                  onclick={() => handleDuplicate(preset.id)}
                  class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  title="Duplicate"
                >
                  <Copy class="w-3 h-3" />
                </button>
                <button
                  onclick={() => handleDelete(preset.id)}
                  class="p-1 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Empty State -->
  {#if presets.length === 0}
    <div
      class="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 text-center"
    >
      <p class="text-sm text-gray-600 dark:text-gray-400">No presets saved yet</p>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
        Click "Save Preset" to save your current props configuration
      </p>
    </div>
  {/if}

  <!-- Tips -->
  <div
    class="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 p-3"
  >
    <p class="text-xs text-orange-900 dark:text-orange-300 font-medium mb-1">Pro Tips</p>
    <ul class="text-xs text-orange-800 dark:text-orange-400 space-y-1">
      <li>⭐ Star presets to mark them as favorites</li>
      <li>🔢 Usage count shows how often you use each preset</li>
      <li>📋 Duplicate presets to create variations</li>
    </ul>
  </div>
</div>
