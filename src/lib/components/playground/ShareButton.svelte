<script lang="ts">
  import { Share2, Check, Copy, Link } from 'lucide-svelte';
  import { playgroundStore } from '../stores/playground.svelte';

  interface Props {
    variant?: 'icon' | 'button';
    class?: string;
  }

  let { variant = 'icon', class: className = '' }: Props = $props();

  let copySuccess = $state(false);
  let showTooltip = $state(false);

  async function handleShare() {
    const success = await playgroundStore.copyShareURL();

    if (success) {
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    }
  }

  function handleMouseEnter() {
    showTooltip = true;
  }

  function handleMouseLeave() {
    showTooltip = false;
  }

  const shareURL = $derived(playgroundStore.getShareURL());
</script>

{#if variant === 'icon'}
  <!-- Icon variant for toolbar -->
  <div class="relative">
    <button
      onclick={handleShare}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
      class="toolbar-icon-button group p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 {copySuccess ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50' : 'hover:bg-blue-50 dark:hover:bg-blue-900/30'} {className}"
      title="Share playground state"
    >
      {#if copySuccess}
        <Check class="w-5 h-5 animate-bounce" />
      {:else}
        <Share2 class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      {/if}
    </button>

    <!-- Tooltip with URL preview -->
    {#if showTooltip && !copySuccess}
      <div class="absolute top-full right-0 mt-2 w-80 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-2xl p-3 z-50 pointer-events-none">
        <div class="flex items-start gap-2">
          <Link class="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold mb-1 text-gray-300">Share this configuration</p>
            <code class="text-[10px] text-blue-300 break-all font-mono">{shareURL}</code>
          </div>
        </div>
        <div class="mt-2 pt-2 border-t border-gray-700">
          <p class="text-[10px] text-gray-400">Click to copy URL to clipboard</p>
        </div>
      </div>
    {/if}

    <!-- Success message -->
    {#if copySuccess}
      <div class="absolute top-full right-0 mt-2 bg-green-500 text-white rounded-lg shadow-xl px-3 py-2 z-50 pointer-events-none animate-fade-in">
        <div class="flex items-center gap-2">
          <Check class="w-4 h-4" />
          <span class="text-xs font-semibold">URL copied!</span>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <!-- Full button variant -->
  <button
    onclick={handleShare}
    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 {className}"
  >
    {#if copySuccess}
      <Check class="w-4 h-4" />
      <span>Copied!</span>
    {:else}
      <Share2 class="w-4 h-4" />
      <span>Share</span>
    {/if}
  </button>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
</style>
