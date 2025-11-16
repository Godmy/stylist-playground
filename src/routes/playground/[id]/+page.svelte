<script lang="ts">
  import { onMount } from 'svelte';
  // Use the library playground components and store
  import {
    playgroundStore,
    PlaygroundSidebar,
    BottomPanel,
    PlaygroundControlPanel,
    CodeViewer,
    GenericCodeViewer,
    Canvas,
    EnhancedExportPanel
  } from '@stylist-svelte/playground';
  import { keyboardShortcuts } from '../../../lib/utils/keyboard-shortcuts';
  import { generateComponentCode } from '../../../lib/utils/code-generator';

  interface Props {
    data: {
      story: any;
    };
  }

  let { data }: Props = $props();

  // Example variants for the component
  const variants = $state([
    {
      name: 'Default',
      description: 'Default component state',
      props: {}
    },
    {
      name: 'With Props',
      description: 'Component with sample props',
      props: { disabled: false }
    }
  ]);

  // Generate code for current props
  const generatedCode = $derived.by(() => {
    return generateComponentCode({
      componentName: data.story.componentName,
      category: data.story.category,
      props: playgroundStore.controlValues, // Use controlValues instead of currentProps
      includeImport: true,
      includeScript: true
    });
  });

  onMount(() => {
    // Don't call init() here - it's called in +layout.svelte
    // Don't call setCurrentStory - let the Story component handle its own state

    // Restore state from URL if present
    playgroundStore.restoreFromURL();

    // Auto-sync state to URL on changes (debounced)
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

    // Register keyboard shortcuts
    keyboardShortcuts.register({
      key: '/',
      ctrl: true,
      description: 'Toggle sidebar',
      action: () => playgroundStore.toggleSidebar()
    });

    keyboardShortcuts.register({
      key: 'd',
      ctrl: true,
      description: 'Toggle dark mode',
      action: () => playgroundStore.toggleDarkMode()
    });

    keyboardShortcuts.register({
      key: 'b',
      ctrl: true,
      description: 'Toggle bottom panel',
      action: () => playgroundStore.toggleBottomPanel()
    });

    keyboardShortcuts.register({
      key: 'g',
      ctrl: true,
      description: 'Toggle grid',
      action: () => playgroundStore.toggleGrid()
    });


    return () => {
      // Cleanup
      clearTimeout(syncTimeout);
      unsubscribe();
      keyboardShortcuts.clear();
    };
  });

  function handlePropsChange(newProps: Record<string, any>) {
    // Update each control value
    Object.entries(newProps).forEach(([key, value]) => {
      playgroundStore.updateControl(key, value);
    });
  }

  let copySuccess = $state(false);

  async function copyCodeToClipboard() {
    try {
      const code = generatedCode;
      await navigator.clipboard.writeText(code);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<!-- Simple canvas-only view -->
<div class="h-full w-full flex flex-col overflow-hidden">
  <Canvas>
    {#if data.story.component}
      {@const StoryComponent = data.story.component}
      {#key data.story.id}
        <StoryComponent />
      {/key}
    {/if}
  </Canvas>
</div>
