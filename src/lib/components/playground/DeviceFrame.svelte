<script lang="ts">
  import type { ViewportSize } from '../types';
  import type { Snippet } from 'svelte';

  interface Props {
    device: ViewportSize;
    children?: Snippet;
  }

  let { device, children }: Props = $props();

  // Device specifications
  const deviceSpecs: Record<
    ViewportSize,
    { width: number; height: number; name: string; color: string }
  > = {
    mobile: { width: 375, height: 667, name: 'iPhone SE', color: 'from-gray-800 to-gray-900' },
    tablet: { width: 768, height: 1024, name: 'iPad', color: 'from-gray-700 to-gray-800' },
    desktop: {
      width: 1440,
      height: 900,
      name: 'Desktop',
      color: 'from-gray-600 to-gray-700'
    },
    fullscreen: { width: 0, height: 0, name: 'Fullscreen', color: '' }
  };

  const spec = $derived(deviceSpecs[device]);
  const showFrame = $derived(device !== 'fullscreen');
</script>

{#if showFrame}
  <div class="flex items-center justify-center p-8">
    <!-- Device Frame -->
    <div class="relative flex flex-col items-center">
      <!-- Device Name Badge -->
      <div
        class="mb-4 px-4 py-2 rounded-full bg-gradient-to-r {spec.color} text-white text-xs font-bold shadow-lg"
      >
        {spec.name} | {spec.width}px x {spec.height}px
      </div>

      <!-- Frame Container -->
      <div class="relative">
        {#if device === 'mobile'}
          <!-- Mobile Phone Frame -->
          <div class="relative">
            <!-- Phone body -->
            <div
              class="bg-gradient-to-br {spec.color} rounded-[3rem] p-3 shadow-2xl"
              style="width: {spec.width + 24}px;"
            >
              <!-- Notch (iPhone style) -->
              <div class="flex justify-center mb-2">
                <div
                  class="bg-black rounded-full h-6 w-32 flex items-center justify-center gap-2"
                >
                  <div class="w-12 h-1 bg-gray-800 rounded-full"></div>
                  <div class="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
              </div>

              <!-- Screen -->
              <div
                class="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-inner"
                style="width: {spec.width}px; height: {spec.height}px;"
              >
                <div class="w-full h-full overflow-auto">
                  {#if children}
                    {@render children()}
                  {/if}
                </div>
              </div>

              <!-- Home indicator (iPhone style) -->
              <div class="flex justify-center mt-2">
                <div class="w-32 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>

            <!-- Volume buttons -->
            <div class="absolute left-0 top-24 w-1 h-12 bg-gray-800 rounded-l-full"></div>
            <div class="absolute left-0 top-40 w-1 h-12 bg-gray-800 rounded-l-full"></div>

            <!-- Power button -->
            <div class="absolute right-0 top-32 w-1 h-16 bg-gray-800 rounded-r-full"></div>
          </div>
        {:else if device === 'tablet'}
          <!-- Tablet Frame -->
          <div class="relative">
            <!-- Tablet body -->
            <div
              class="bg-gradient-to-br {spec.color} rounded-[2rem] p-4 shadow-2xl"
              style="width: {spec.width + 32}px;"
            >
              <!-- Camera -->
              <div class="flex justify-center mb-2">
                <div class="w-3 h-3 bg-gray-900 rounded-full"></div>
              </div>

              <!-- Screen -->
              <div
                class="bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden shadow-inner"
                style="width: {spec.width}px; height: {spec.height}px;"
              >
                <div class="w-full h-full overflow-auto">
                  {#if children}
                    {@render children()}
                  {/if}
                </div>
              </div>

              <!-- Home button -->
              <div class="flex justify-center mt-2">
                <div class="w-12 h-12 bg-gray-900 rounded-full border-2 border-gray-700"></div>
              </div>
            </div>

            <!-- Volume buttons -->
            <div class="absolute right-0 top-32 w-1 h-16 bg-gray-800 rounded-r-full"></div>
          </div>
        {:else if device === 'desktop'}
          <!-- Desktop Monitor Frame -->
          <div class="relative flex flex-col items-center">
            <!-- Monitor -->
            <div class="bg-gradient-to-br {spec.color} rounded-2xl p-4 shadow-2xl">
              <!-- Bezel -->
              <div class="bg-black rounded-xl p-6">
                <!-- Screen -->
                <div
                  class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-inner"
                  style="width: {spec.width}px; height: {spec.height}px;"
                >
                  <div class="w-full h-full overflow-auto">
                    {#if children}
                      {@render children()}
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Monitor logo/light -->
              <div class="flex justify-center mt-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <!-- Stand -->
            <div class="w-32 h-2 bg-gradient-to-r {spec.color} rounded-full mt-2"></div>
            <div class="w-48 h-3 bg-gradient-to-r {spec.color} rounded-full mt-1"></div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <!-- Fullscreen mode - no frame -->
  <div class="w-full h-full">
    {#if children}
      {@render children()}
    {/if}
  </div>
{/if}

<style>
  /* Add smooth scrolling */
  :global(.device-content) {
    scroll-behavior: smooth;
  }
</style>
