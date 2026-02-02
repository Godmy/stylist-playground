<script lang="ts">
  import { X, Package, Tag, FileCode, ExternalLink, Copy, CheckCircle, Info, Layers, Calendar, User } from 'lucide-svelte';

  interface Props {
    componentName?: string;
    category?: string;
    subcategory?: string;
    description?: string;
    propsCount?: number;
    examples?: string[];
    npmPackage?: string;
    version?: string;
    author?: string;
    lastUpdated?: string;
    isOpen?: boolean;
    onClose?: () => void;
  }

  let {
    componentName = '',
    category = '',
    subcategory = '',
    description = 'A flexible and customizable UI component designed for modern web applications.',
    propsCount = 0,
    examples = [
      'Basic usage with default props',
      'Custom styling and theming',
      'Advanced interactions and states',
      'Responsive behavior across devices'
    ],
    npmPackage = '@stylist-svelte/components',
    version = '1.0.0',
    author = 'Stylist Team',
    lastUpdated = '2025-01-13',
    isOpen = true,
    onClose = () => {}
  }: Props = $props();

  let copySuccess = $state(false);

  async function copyNpmCommand() {
    try {
      await navigator.clipboard.writeText(`npm install ${npmPackage}`);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function handleClose() {
    onClose();
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="button"
    tabindex="0"
    aria-label="Close component info"
  ></div>

  <!-- Modal -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
    <div
      class="info-card-modal w-full max-w-2xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden pointer-events-auto animate-scale-in"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="component-info-title"
      tabindex="-1"
    >
      <!-- Header -->
      <div class="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
        <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        <div class="relative flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <Package class="w-5 h-5 text-white" />
              <h2 id="component-info-title" class="text-2xl font-bold text-white">
                {componentName || 'Component Info'}
              </h2>
            </div>
            {#if category || subcategory}
              <div class="flex items-center gap-2">
                {#if category}
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                    {category}
                  </span>
                {/if}
                {#if subcategory}
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                    {subcategory}
                  </span>
                {/if}
              </div>
            {/if}
          </div>
          <button
            onclick={handleClose}
            class="group p-2 rounded-lg hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
            title="Close"
          >
            <X class="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 max-h-[60vh] overflow-y-auto">
        <!-- Description -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <Info class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">
              Description
            </h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <!-- Props Count -->
          <div class="stat-card p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
            <div class="flex items-center gap-2 mb-2">
              <Layers class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span class="text-xs font-semibold text-indigo-900 dark:text-indigo-200">Props</span>
            </div>
            <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {propsCount}
            </p>
          </div>

          <!-- Version -->
          <div class="stat-card p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border-2 border-green-200 dark:border-green-800">
            <div class="flex items-center gap-2 mb-2">
              <Tag class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-xs font-semibold text-green-900 dark:text-green-200">Version</span>
            </div>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400 font-mono">
              {version}
            </p>
          </div>

          <!-- Author -->
          <div class="stat-card p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <div class="flex items-center gap-2 mb-2">
              <User class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span class="text-xs font-semibold text-purple-900 dark:text-purple-200">Author</span>
            </div>
            <p class="text-sm font-bold text-purple-600 dark:text-purple-400">
              {author}
            </p>
          </div>

          <!-- Last Updated -->
          <div class="stat-card p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl border-2 border-orange-200 dark:border-orange-800">
            <div class="flex items-center gap-2 mb-2">
              <Calendar class="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span class="text-xs font-semibold text-orange-900 dark:text-orange-200">Updated</span>
            </div>
            <p class="text-sm font-bold text-orange-600 dark:text-orange-400">
              {lastUpdated}
            </p>
          </div>
        </div>

        <!-- Installation -->
        {#if npmPackage}
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <Package class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                Installation
              </h3>
            </div>
            <div class="relative">
              <div class="bg-gray-900 dark:bg-black rounded-lg p-4 border-2 border-gray-700">
                <code class="text-sm font-mono text-green-400">
                  npm install {npmPackage}
                </code>
              </div>
              <button
                onclick={copyNpmCommand}
                class="absolute top-2 right-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all hover:scale-110 active:scale-95"
                title="Copy command"
              >
                {#if copySuccess}
                  <CheckCircle class="w-4 h-4 text-green-400" />
                {:else}
                  <Copy class="w-4 h-4 text-gray-400 hover:text-white" />
                {/if}
              </button>
            </div>
          </div>
        {/if}

        <!-- Examples -->
        {#if examples && examples.length > 0}
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <FileCode class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                Usage Examples
              </h3>
            </div>
            <ul class="space-y-2">
              {#each examples as example}
                <li class="flex items-start gap-2 p-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span class="text-indigo-500 mt-0.5">•</span>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{example}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Links -->
        <div class="flex gap-3">
          <a
            href="https://www.npmjs.com/package/{npmPackage}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 group flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 dark:hover:from-red-800/40 dark:hover:to-orange-800/40 text-red-700 dark:text-red-300 rounded-lg border-2 border-red-200 dark:border-red-800 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md font-semibold text-sm"
          >
            <Package class="w-4 h-4" />
            NPM Package
            <ExternalLink class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <a
            href="/docs/components/{componentName}"
            class="flex-1 group flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 dark:hover:from-indigo-800/40 dark:hover:to-purple-800/40 text-indigo-700 dark:text-indigo-300 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md font-semibold text-sm"
          >
            <FileCode class="w-4 h-4" />
            Documentation
            <ExternalLink class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }

  .animate-scale-in {
    animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .stat-card {
    animation: fade-slide-up 0.3s ease-out;
  }

  @keyframes fade-slide-up {
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