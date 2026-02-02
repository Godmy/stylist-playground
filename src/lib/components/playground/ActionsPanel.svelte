<script lang="ts">
  import { RotateCcw, Download, Copy, Link, FileCode, Share2 } from 'lucide-svelte';
  import { playgroundStore } from '../stores/playground.svelte';
  import type { ControlConfig } from '../types';

  interface Props {
    componentName?: string;
    generatedCode?: string;
  }

  let { componentName = '', generatedCode = '' }: Props = $props();

  let copySuccess = $state(false);
  let linkCopied = $state(false);

  function resetAllProps() {
    const story = playgroundStore.getCurrentStory();
    if (story?.controls) {
      story.controls.forEach((control: ControlConfig) => {
        playgroundStore.updateControl(control.name, control.defaultValue);
      });
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  async function copyPlaygroundLink() {
    try {
      const link = window.location.href;
      await navigator.clipboard.writeText(link);
      linkCopied = true;
      setTimeout(() => {
        linkCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }

  function downloadCode() {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentName || 'component'}.svelte`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportComponent() {
    // This could be extended to export in different formats
    downloadCode();
  }

  function shareComponent() {
    copyPlaygroundLink();
  }
</script>

<div class="actions-panel p-6 h-full overflow-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
  <h3 class="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
    Quick Actions
  </h3>

  <div class="grid grid-cols-2 gap-4">
    <!-- Reset All Props -->
    <button
      onclick={resetAllProps}
      class="group action-card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <RotateCcw class="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:rotate-180 transition-transform duration-500" />
        </div>
        <div class="text-center">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Reset All Props</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">Reset all properties to defaults</p>
        </div>
      </div>
    </button>

    <!-- Copy Code -->
    <button
      onclick={copyCode}
      class="group action-card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          {#if copySuccess}
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          {:else}
            <Copy class="w-6 h-6 text-green-600 dark:text-green-400" />
          {/if}
        </div>
        <div class="text-center">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">
            {copySuccess ? 'Copied!' : 'Copy Code'}
          </h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">Copy component code to clipboard</p>
        </div>
      </div>
    </button>

    <!-- Download Code -->
    <button
      onclick={downloadCode}
      class="group action-card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Download class="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:translate-y-1 transition-transform" />
        </div>
        <div class="text-center">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Download Code</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">Download as .svelte file</p>
        </div>
      </div>
    </button>

    <!-- Copy Playground Link -->
    <button
      onclick={copyPlaygroundLink}
      class="group action-card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          {#if linkCopied}
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          {:else}
            <Link class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          {/if}
        </div>
        <div class="text-center">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">
            {linkCopied ? 'Link Copied!' : 'Copy Playground Link'}
          </h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">Share this playground state</p>
        </div>
      </div>
    </button>

    <!-- Export Component -->
    <button
      onclick={exportComponent}
      class="group action-card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FileCode class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div class="text-center">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Export Component</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">Export in various formats</p>
        </div>
      </div>
    </button>

    <!-- Share Component -->
    <button
      onclick={shareComponent}
      class="group action-card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Share2 class="w-6 h-6 text-pink-600 dark:text-pink-400" />
        </div>
        <div class="text-center">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Share Component</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">Share via link or social media</p>
        </div>
      </div>
    </button>
  </div>
</div>

<style>
  .action-card {
    animation: fade-in 0.3s ease-out;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
