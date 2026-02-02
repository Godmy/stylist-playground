<script lang="ts">
  import { playgroundStore } from '../stores/playground.svelte';
  import type { ViewportSize } from '../types';
  import { Smartphone, Tablet, Monitor, Maximize2, RotateCw } from 'lucide-svelte';

  let currentViewport = $derived(playgroundStore.state.viewport);
  let showFrames = $state(true);
  let orientation: 'portrait' | 'landscape' = $state('portrait');

  const devices: {
    id: ViewportSize;
    icon: any;
    label: string;
    description: string;
  }[] = [
    {
      id: 'mobile',
      icon: Smartphone,
      label: 'Mobile',
      description: '375×667'
    },
    {
      id: 'tablet',
      icon: Tablet,
      label: 'Tablet',
      description: '768×1024'
    },
    {
      id: 'desktop',
      icon: Monitor,
      label: 'Desktop',
      description: '1440×900'
    },
    {
      id: 'fullscreen',
      icon: Maximize2,
      label: 'Fullscreen',
      description: 'Adaptive'
    }
  ];

  function handleDeviceChange(viewport: ViewportSize) {
    playgroundStore.setViewport(viewport);
  }

  function toggleOrientation() {
    orientation = orientation === 'portrait' ? 'landscape' : 'portrait';
  }
</script>

<div class="device-selector flex items-center gap-2">
  <!-- Device Buttons -->
  <div
    class="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 shadow-sm"
  >
    {#each devices as device}
      {@const Icon = device.icon}
      <button
        onclick={() => handleDeviceChange(device.id)}
        class="group relative flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-700 {currentViewport ===
        device.id
          ? 'bg-orange-500 text-white hover:bg-orange-600'
          : 'text-gray-600 dark:text-gray-400'}"
        title={device.description}
      >
        <Icon class="w-4 h-4" />
        <span class="text-xs font-medium">{device.label}</span>

        <!-- Active indicator -->
        {#if currentViewport === device.id}
          <div
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"
          ></div>
        {/if}

        <!-- Tooltip -->
        <div
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          {device.description}
        </div>
      </button>
    {/each}
  </div>

  <!-- Orientation Toggle (for mobile/tablet) -->
  {#if currentViewport === 'mobile' || currentViewport === 'tablet'}
    <button
      onclick={toggleOrientation}
      class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm"
      title="Rotate device"
    >
      <RotateCw class="w-4 h-4" />
      <span class="text-xs font-medium capitalize">{orientation}</span>
    </button>
  {/if}

  <!-- Frame Toggle -->
  <button
    onclick={() => (showFrames = !showFrames)}
    class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm"
    title="Toggle device frames"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <span class="text-xs font-medium">{showFrames ? 'Hide Frame' : 'Show Frame'}</span>
  </button>
</div>

<style>
</style>
