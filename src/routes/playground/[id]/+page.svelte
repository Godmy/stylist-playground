<script lang="ts">
  import { onMount } from 'svelte';
  import { playgroundStore, Canvas } from '$playground/playground';
  import type { Story as PlaygroundStory } from '$playground/playground/stories';
  import {
    deinitKeyboardShortcuts,
    initKeyboardShortcuts,
    registerShortcut
  } from '$playground/playground';

  interface Props {
    data: {
      story: PlaygroundStory;
    };
  }

  let { data }: Props = $props();

  onMount(() => {
    initKeyboardShortcuts();
    playgroundStore.restoreFromURL();

    let syncTimeout: ReturnType<typeof setTimeout>;
    const syncToURL = () => {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        playgroundStore.syncToURL(true);
      }, 500); // Debounce 500ms
    };

    // Watch for state changes
    const unsubscribe = $effect.root(() => {
      $effect(() => {
        // Track state changes
        playgroundStore.state.viewport;
        playgroundStore.state.darkMode;
        playgroundStore.uiState.background;
        playgroundStore.uiState.showGrid;
        playgroundStore.uiState.zoom;
        playgroundStore.controlValues;

        // Sync to URL
        syncToURL();
      });
    });

    registerShortcut({
      key: '/',
      ctrl: true,
      description: 'Toggle sidebar',
      action: () => playgroundStore.toggleSidebar()
    });

    registerShortcut({
      key: 'd',
      ctrl: true,
      description: 'Toggle dark mode',
      action: () => playgroundStore.toggleDarkMode()
    });

    registerShortcut({
      key: 'b',
      ctrl: true,
      description: 'Toggle bottom panel',
      action: () => playgroundStore.toggleBottomPanel()
    });

    registerShortcut({
      key: 'g',
      ctrl: true,
      description: 'Toggle grid',
      action: () => playgroundStore.toggleGrid()
    });

    return () => {
      clearTimeout(syncTimeout);
      unsubscribe();
      deinitKeyboardShortcuts();
    };
  });
</script>

<!-- Simple canvas-only view -->
<div class="h-full w-full flex flex-col overflow-hidden">
  <Canvas>
    {#if data.story.component}
      {@const StoryComponent = data.story.component}
      {@const storyProps = playgroundStore.controlValues}
      {#key data.story.id}
        <StoryComponent {...storyProps} />
      {/key}
    {/if}
  </Canvas>
</div>
