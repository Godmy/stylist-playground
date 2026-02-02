<script lang="ts">
  import type { ComponentType, Snippet } from 'svelte';
  import { onMount } from 'svelte';

  interface Props {
    component: ComponentType | null | undefined;
    props?: Record<string, any>;
    children?: Snippet;
  }

  let { component, props = {}, children }: Props = $props();

  let error = $state<string | null>(null);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;

    // Global error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('[ErrorBoundary] Caught error:', event.error);
      error = event.error?.message || 'Произошла непредвиденная ошибка';
      event.preventDefault();
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  });

  // Reset error when component changes
  $effect(() => {
    if (component) {
      error = null;
    }
  });
</script>

{#if error}
  <!-- Error UI -->
  <div class="flex flex-col items-center justify-center gap-4 p-8 text-center">
    <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
      <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Ошибка рендеринга компонента
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 max-w-md">
        {error}
      </p>
    </div>
    <button
      onclick={() => { error = null; }}
      class="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
    >
      Закрыть
    </button>
  </div>
{:else if component}
  {@const DynamicComponent = component}
  <DynamicComponent {...props} />
{:else if children}
  {@render children()}
{/if}
