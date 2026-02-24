<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { playgroundStore } from '../../../state/playground.svelte';
  import type { ViewportSize } from '../../../types';
  import DeviceFrame from './DeviceFrame.svelte';
  import ErrorBoundary from './ErrorBoundary.svelte';

  interface Props {
    component?: ComponentType | null;
    props?: Record<string, any>;
    children?: any;
  }

  let { component = null, props = {}, children }: Props = $props();

  // Pan & Zoom state
  let panX = $state(0);
  let panY = $state(0);
  let isPanning = $state(false);
  let lastPointerX = $state(0);
  let lastPointerY = $state(0);
  let canvasContainer: HTMLDivElement;

  // Viewport sizes mapping
  const viewportSizes: Record<ViewportSize, string> = {
    mobile: '375px',
    tablet: '768px',
    desktop: '1440px',
    fullscreen: '100%'
  };

  // Get current viewport width
  const currentViewportWidth = $derived(viewportSizes[playgroundStore.state.viewport as ViewportSize]);

  // Background classes
  const backgroundClasses: Record<string, string> = {
    white: 'bg-white',
    gray: 'bg-gray-50 dark:bg-gray-900',
    dark: 'bg-gray-900',
    transparent: 'bg-transparent'
  };

  const backgroundClass = $derived(backgroundClasses[playgroundStore.uiState.background]);
  const showGrid = $derived(playgroundStore.uiState.showGrid);

  // Pan handlers
  function handlePointerDown(e: PointerEvent) {
    // Only pan with middle mouse button or space + left click
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      isPanning = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      if (canvasContainer) {
        canvasContainer.setPointerCapture(e.pointerId);
        canvasContainer.style.cursor = 'grabbing';
      }
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (isPanning) {
      e.preventDefault();
      const deltaX = e.clientX - lastPointerX;
      const deltaY = e.clientY - lastPointerY;
      panX += deltaX;
      panY += deltaY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    }
  }

  function handlePointerUp(e: PointerEvent) {
    if (isPanning) {
      isPanning = false;
      if (canvasContainer) {
        canvasContainer.releasePointerCapture(e.pointerId);
        canvasContainer.style.cursor = '';
      }
    }
  }

  // Wheel zoom (with ctrl/cmd)
  function handleWheel(e: WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.max(0.1, Math.min(5, playgroundStore.uiState.zoom + delta));

      if (newZoom !== playgroundStore.uiState.zoom) {
        playgroundStore.uiState.zoom = newZoom;
      }
    }
  }

</script>

<style>
  .grid-overlay {
    background-image:
      linear-gradient(rgba(249, 115, 22, 0.15) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249, 115, 22, 0.15) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: grid-fade-in 0.3s ease-out;
  }

  @keyframes grid-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .canvas-zoom {
    will-change: transform;
  }

  .canvas-container {
    background:
      radial-gradient(circle at 20% 20%, var(--playground-glow-light-1, rgba(249, 115, 22, 0.08)) 0%, transparent 55%),
      radial-gradient(circle at 80% 80%, var(--playground-glow-light-2, rgba(239, 68, 68, 0.08)) 0%, transparent 55%);
  }

  :global(.dark) .canvas-container {
    background:
      radial-gradient(circle at 20% 20%, var(--playground-glow-dark-1, rgba(249, 115, 22, 0.12)) 0%, transparent 55%),
      radial-gradient(circle at 80% 80%, var(--playground-glow-dark-2, rgba(168, 85, 247, 0.12)) 0%, transparent 55%);
  }

  .canvas-frame {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .canvas-frame:hover {
    box-shadow:
      0 20px 25px -5px var(--playground-accent-shadow, rgba(249, 115, 22, 0.15)),
      0 10px 10px -5px var(--playground-accent-shadow, rgba(249, 115, 22, 0.08));
  }

  :global(.dark) .canvas-frame:hover {
    box-shadow:
      0 20px 25px -5px var(--playground-accent-shadow, rgba(249, 115, 22, 0.25)),
      0 10px 10px -5px var(--playground-accent-shadow, rgba(249, 115, 22, 0.15));
  }

  .panning {
    cursor: grab;
    user-select: none;
  }

  .panning:active {
    cursor: grabbing;
  }
</style>

<div class="flex-1 flex flex-col canvas-container bg-gradient-to-br from-[var(--playground-gradient-light-from,#f9fafb)] via-[var(--playground-gradient-light-via,#f3f4f6)] to-[var(--playground-gradient-light-to,#f3f4f6)] dark:from-[var(--playground-gradient-dark-from,#111827)] dark:via-[var(--playground-gradient-dark-via,#0f172a)] dark:to-[var(--playground-gradient-dark-to,#111827)] overflow-hidden">
  <!-- Canvas area -->
  <div
    bind:this={canvasContainer}
    class="flex-1 overflow-auto p-8 flex relative"
    class:panning={isPanning}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onwheel={handleWheel}
  >
    <div class="w-full min-h-full flex items-center justify-center">
      <div
        class="canvas-zoom"
        style="transform: translate({panX}px, {panY}px) scale({playgroundStore.uiState.zoom}); transform-origin: center; transition: {isPanning ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'};"
      >
      {#if playgroundStore.uiState.showDeviceFrame && playgroundStore.state.viewport !== 'fullscreen'}
        <!-- Device Frame Wrapper -->
        <DeviceFrame device={playgroundStore.state.viewport}>
          <div class="relative w-full h-full {backgroundClass}">
            {#if showGrid}
              <div class="grid-overlay absolute inset-0 pointer-events-none rounded-[2.5rem]"></div>
            {/if}
            <div class="relative z-10 p-8">
              <ErrorBoundary {component} {props}>
                {#if children}
                  {@render children()}
                {/if}
              </ErrorBoundary>
            </div>
          </div>
        </DeviceFrame>
      {:else}
        <!-- Regular Canvas Frame -->
        <div
          class="canvas-frame rounded-2xl shadow-2xl relative overflow-hidden {backgroundClass} border-2 border-gray-200/50 dark:border-gray-700/50 pointer-events-auto"
          style="width: {currentViewportWidth}; min-height: 400px;"
        >
          {#if showGrid}
            <div class="grid-overlay absolute inset-0 pointer-events-none rounded-2xl"></div>
          {/if}
          <!-- Component render area -->
          <div class="relative z-10 p-8">
            <ErrorBoundary {component} {props}>
              {#if children}
                {@render children()}
              {/if}
            </ErrorBoundary>
          </div>
        </div>
      {/if}
      </div>
    </div>
  </div>
</div>

