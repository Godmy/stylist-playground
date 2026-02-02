<script lang="ts">
  import { playgroundStore } from '../stores/playground.svelte';
  import { Check, Plus } from 'lucide-svelte';
  import type { VariantConfig } from '../types';

  interface Props {
    variants?: VariantConfig[];
  }

  let { variants = [] }: Props = $props();

  let selectedVariant = $state<string | null>(null);

  // Get current story variants or use provided variants
  const currentStory = $derived(playgroundStore.getCurrentStory());
  const availableVariants = $derived(variants.length > 0 ? variants : (currentStory?.variants || []));

  function applyVariant(variant: VariantConfig) {
    if (variant.props) {
      Object.entries(variant.props).forEach(([key, value]) => {
        playgroundStore.updateControl(key, value);
      });
      selectedVariant = variant.name;
    }
  }

  function createCustomVariant() {
    // This could open a modal to save current props as a new variant
    console.log('Create custom variant with current props:', playgroundStore.controlValues);
  }

  // Default variants if none provided
  const defaultVariants: VariantConfig[] = [
    {
      name: 'Default',
      description: 'Default component state',
      props: {}
    },
    {
      name: 'Small',
      description: 'Small size variant',
      props: { size: 'sm' }
    },
    {
      name: 'Medium',
      description: 'Medium size variant',
      props: { size: 'md' }
    },
    {
      name: 'Large',
      description: 'Large size variant',
      props: { size: 'lg' }
    },
    {
      name: 'Disabled',
      description: 'Disabled state',
      props: { disabled: true }
    }
  ];

  const displayVariants = $derived(availableVariants.length > 0 ? availableVariants : defaultVariants);
</script>

<div class="variants-panel p-6 h-full overflow-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
      Component Variants
    </h3>
    <button
      onclick={createCustomVariant}
      class="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 dark:hover:from-indigo-800/40 dark:hover:to-purple-800/40 text-indigo-700 dark:text-indigo-300 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
      title="Save current props as variant"
    >
      <Plus class="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
      New Variant
    </button>
  </div>

  {#if displayVariants.length === 0}
    <div class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
        No variants available
      </p>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Create custom variants to save prop configurations
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-4">
      {#each displayVariants as variant, index}
        <button
          onclick={() => applyVariant(variant)}
          class="variant-card group p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-left {selectedVariant === variant.name ? 'border-indigo-500 dark:border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'}"
          style="animation-delay: {index * 50}ms"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">
                {variant.name}
              </h4>
              {#if variant.description}
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {variant.description}
                </p>
              {/if}
            </div>
            {#if selectedVariant === variant.name}
              <div class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Check class="w-4 h-4 text-white" />
              </div>
            {/if}
          </div>

          {#if variant.props && Object.keys(variant.props).length > 0}
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-wrap gap-1.5">
                {#each Object.entries(variant.props) as [key, value]}
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {key}: {JSON.stringify(value)}
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Info section -->
  <div class="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
    <h4 class="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2">About Variants</h4>
    <p class="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
      Variants are pre-configured prop combinations that demonstrate different use cases of the component.
      Click on a variant to apply its configuration instantly.
    </p>
  </div>
</div>

<style>
  .variant-card {
    animation: fade-slide-in 0.3s ease-out;
  }

  @keyframes fade-slide-in {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
