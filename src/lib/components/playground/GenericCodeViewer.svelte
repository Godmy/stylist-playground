<script lang="ts">
  import { SyntaxHighlighter } from '../utils/syntax-highlighter';

  interface Props {
    code?: string;
    language?: string;
  }

  let { code = '', language = 'svelte' }: Props = $props();
  let copied = $state(false);
  let highlightedCode = $state('');

  // Update highlighted code when code or language changes
  $effect(() => {
    updateHighlightedCode();
  });

  async function updateHighlightedCode() {
    if (code) {
      highlightedCode = await SyntaxHighlighter.highlight(
        code,
        language,
        'github-dark'
      );
    }
  }

  async function copyCode() {
    try {
      if (code) {
        await navigator.clipboard.writeText(code);
        copied = true;
        setTimeout(() => {
          copied = false;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<div class="bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
  <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 rounded-full bg-red-500"></div>
      <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
      <div class="w-2 h-2 rounded-full bg-green-500"></div>
      <span class="ml-2 text-xs font-mono text-gray-400">{language}</span>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-gray-800 hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 text-gray-200 font-medium shadow-lg"
        onclick={copyCode}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {#if copied}
          <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="text-green-400">Copied!</span>
        {:else}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy</span>
        {/if}
      </button>
    </div>
  </div>

  <div class="p-5 max-h-96 overflow-auto bg-gray-950/50 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
    {#if code && highlightedCode}
      <pre class="text-sm font-mono leading-relaxed">{@html highlightedCode}</pre>
    {:else if code}
      <pre class="text-sm font-mono leading-relaxed text-gray-300">{code}</pre>
    {:else}
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <svg class="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <p class="text-sm text-gray-500">No code to display</p>
        <p class="text-xs text-gray-600 mt-1">Adjust component props to see generated code</p>
      </div>
    {/if}
  </div>
</div>