<script lang="ts">
  import type { Snippet } from 'svelte';
  import PlaygroundHeader from '../../lib/components/PlaygroundHeader.svelte';
  import { onMount, setContext } from 'svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();

  // Component tree visibility
  let showComponentTree = $state(false);

  // Set context for child components to access
  setContext('showComponentTree', {
    get value() { return showComponentTree; },
    set value(v: boolean) { showComponentTree = v; }
  });

  function toggleComponentTree() {
    showComponentTree = !showComponentTree;
  }

  onMount(() => {
    // Make functions available globally for header to call
    (window as any).__toggleComponentTree = toggleComponentTree;
    (window as any).__setComponentTreeState = (open: boolean) => {
      showComponentTree = open;
    };
  });
</script>

<svelte:head>
  <style>
    body {
      overflow: hidden !important;
      height: 100vh !important;
      max-height: 100vh !important;
    }
  </style>
</svelte:head>

<!-- Playground layout - full screen with custom header -->
<div class="fixed top-0 left-0 right-0 bottom-0 flex flex-col overflow-hidden">
  <PlaygroundHeader {showComponentTree} onToggleComponentTree={toggleComponentTree} />
  <div class="flex-1 overflow-hidden">
    {@render children()}
  </div>
</div>
