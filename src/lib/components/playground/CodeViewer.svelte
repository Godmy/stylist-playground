<script lang="ts">
  import { onMount } from 'svelte';
  import { playgroundStore } from '../stores/playground.svelte';
  import { generateCode } from '$stylist/utils/code-preview';
  import { SyntaxHighlighter } from '../utils/syntax-highlighter';

  let currentStory = $derived(playgroundStore.getCurrentStory());
  let controlValues = $derived(playgroundStore.controlValues);
  let copied = $state(false);
  let highlightedCode = $state('');

  let generatedCode = $derived(() => {
    if (!currentStory?.component) return '';

    return generateCode({
      componentName: currentStory.title,
      props: controlValues
    });
  });

  // Update highlighted code when generated code changes
  $effect(() => {
    if (generatedCode()) {
      updateHighlightedCode();
    }
  });

  async function updateHighlightedCode() {
    // Use syntax highlighting for Svelte code
    highlightedCode = await SyntaxHighlighter.highlight(
      generatedCode(),
      'svelte',
      'github-dark'
    );
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode());
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  // Initialize the highlighted code when component mounts
  onMount(() => {
    updateHighlightedCode();
  });
</script>

<div class="bg-gray-900 text-gray-100 rounded-lg overflow-hidden shadow-lg">
  <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
    <h3 class="text-sm font-semibold">Code</h3>
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition-colors text-gray-200"
        onclick={copyCode}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {#if copied}
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        {:else}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        {/if}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      <button
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition-colors text-gray-200"
        onclick={() => playgroundStore.toggleCode()}
        title="Close code viewer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  <div class="p-4 max-h-80 overflow-auto bg-gray-900/50"> 
    {@html highlightedCode}
  </div>
</div>
