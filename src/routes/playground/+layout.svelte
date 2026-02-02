<script lang="ts">
  import type { Snippet } from 'svelte';
  import PlaygroundHeader from '../../lib/components/PlaygroundHeader.svelte';
  import Toast from '../../lib/components/playground/Toast.svelte';
  import { onMount, setContext } from 'svelte';
  import { playgroundStore } from '../../lib/components/stores/playground.svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();

  // Component tree visibility - синхронизировано с глобальным стором
  let showComponentTree = $derived(playgroundStore.uiState.componentTreeOpen);

  // AI Panel visibility - синхронизировано с глобальным стором
  let showAIPanel = $derived(playgroundStore.uiState.aiPanelOpen);

  // Drawing mode state
  let drawingMode = $state(false);
  let drawColor = $state('#ef4444'); // red by default

  // Toast notification state
  let showToast = $state(false);
  let toastMessage = $state('');

  // Set context for child components to access
  setContext('showComponentTree', {
    get value() { return showComponentTree; },
    set value(v: boolean) {
      // Изменяем через глобальный стор
      if (v && !playgroundStore.uiState.componentTreeOpen) {
        playgroundStore.toggleComponentTree();
      } else if (!v && playgroundStore.uiState.componentTreeOpen) {
        playgroundStore.toggleComponentTree();
      }
    }
  });

  setContext('showAIPanel', {
    get value() { return showAIPanel; },
    set value(v: boolean) {
      // Изменяем через глобальный стор
      if (v && !playgroundStore.uiState.aiPanelOpen) {
        playgroundStore.toggleAIPanel();
      } else if (!v && playgroundStore.uiState.aiPanelOpen) {
        playgroundStore.toggleAIPanel();
      }
    }
  });

  setContext('drawingMode', {
    get value() { return drawingMode; },
    set value(v: boolean) { drawingMode = v; }
  });

  setContext('drawColor', {
    get value() { return drawColor; },
    set value(v: string) { drawColor = v; }
  });

  function toggleComponentTree() {
    playgroundStore.toggleComponentTree();
  }

  function toggleAIPanel() {
    playgroundStore.toggleAIPanel();
  }

  function toggleDrawingMode() {
    drawingMode = !drawingMode;
  }

  async function takeScreenshot() {
    if (typeof window === 'undefined') return;

    try {
      // Dynamically import html2canvas
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      // Capture the entire page including header
      const pageElement = document.querySelector('.fixed.top-0.left-0.right-0.bottom-0') as HTMLElement || document.body;

      const screenshotCanvas = await html2canvas(pageElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scale: 1,
        width: window.innerWidth,
        height: window.innerHeight,
        // Ignore elements that might have unsupported CSS
        ignoreElements: (element) => {
          // Ignore drawing overlay and toast
          if (element.classList.contains('drawing-overlay') ||
              element.classList.contains('toast')) {
            return true;
          }

          // Ignore elements with problematic styles
          const style = window.getComputedStyle(element);
          const bgImage = style.backgroundImage;

          // Skip elements with oklab/oklch gradients
          if (bgImage && (bgImage.includes('oklab') || bgImage.includes('oklch'))) {
            return true;
          }

          return false;
        },
        onclone: (clonedDoc) => {
          // Remove problematic CSS from cloned document
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style) {
              const bgImage = htmlEl.style.backgroundImage;
              if (bgImage && (bgImage.includes('oklab') || bgImage.includes('oklch'))) {
                htmlEl.style.backgroundImage = 'none';
                htmlEl.style.backgroundColor = '#f3f4f6';
              }
            }
          });
        }
      });

      // If drawing mode is active, overlay the drawings
      if (drawingMode) {
        const drawingCanvas = document.querySelector('.drawing-canvas') as HTMLCanvasElement;
        if (drawingCanvas) {
          const ctx = screenshotCanvas.getContext('2d');
          if (ctx) {
            // Draw the drawing canvas on top of screenshot at correct position (56px from top)
            ctx.drawImage(drawingCanvas, 0, 56);
          }
        }
      }

      // Convert to blob
      screenshotCanvas.toBlob(async (blob) => {
        if (blob) {
          // Save to project static folder via API
          const formData = new FormData();
          formData.append('screenshot', blob, `screenshot-${Date.now()}.png`);

          try {
            const response = await fetch('/api/save-screenshot', {
              method: 'POST',
              body: formData
            });

            if (response.ok) {
              const result = await response.json();
              toastMessage = `Скриншот сохранён: ${result.path}`;
              showToast = true;
              return;
            }
          } catch (apiError) {
            console.log('API not available, using fallback');
          }

          // Fallback: download locally
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `stylist-screenshot-${Date.now()}.png`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 100);

          toastMessage = 'Скриншот сохранён в Downloads';
          showToast = true;
        } else {
          throw new Error('Не удалось создать изображение');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Screenshot error:', error);
      toastMessage = 'Не удалось создать скриншот';
      showToast = true;
    }
  }

  onMount(() => {
    // Make functions available globally for header to call
    (window as any).__toggleComponentTree = toggleComponentTree;
    (window as any).__setComponentTreeState = (open: boolean) => {
      // Синхронизируем с глобальным стором
      if (open && !playgroundStore.uiState.componentTreeOpen) {
        playgroundStore.toggleComponentTree();
      } else if (!open && playgroundStore.uiState.componentTreeOpen) {
        playgroundStore.toggleComponentTree();
      }
    };
  });
</script>

<svelte:head>
  <style>
    body {
      overflow: hidden !important;
      height: 100vh !important;
      max-height: 100vh !important;
    }
  </style>
</svelte:head>

<!-- Playground layout - full screen with custom header -->
<div class="fixed top-0 left-0 right-0 bottom-0 flex flex-col overflow-hidden">
  <PlaygroundHeader
    {showComponentTree}
    {showAIPanel}
    {drawingMode}
    {drawColor}
    onToggleComponentTree={toggleComponentTree}
    onToggleAIPanel={toggleAIPanel}
    onToggleDrawingMode={toggleDrawingMode}
    onTakeScreenshot={takeScreenshot}
    onChangeDrawColor={(color) => drawColor = color}
  />
  <div class="flex-1 overflow-hidden">
    {@render children()}
  </div>
</div>

<!-- Toast notification -->
{#if showToast}
  <Toast
    message={toastMessage}
    onClose={() => showToast = false}
  />
{/if}
