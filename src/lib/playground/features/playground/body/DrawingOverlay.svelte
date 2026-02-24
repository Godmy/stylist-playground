<script lang="ts">
  interface Props {
    drawColor?: string;
    onClose?: () => void;
  }

  let { drawColor = '#ef4444', onClose }: Props = $props();

  // Drawing state
  let isDrawing = $state(false);
  let paths: Array<{ points: Array<{ x: number; y: number }>; color: string }> = $state([]);
  let lastPoint: { x: number; y: number } | null = null;

  let canvasElement: HTMLCanvasElement | undefined = $state();
  let ctx: CanvasRenderingContext2D | null = null;

  function handlePointerDown(e: PointerEvent) {
    if (!ctx) return;

    isDrawing = true;
    // Adjust Y coordinate because canvas starts at 56px
    const x = e.clientX;
    const y = e.clientY - 56;
    lastPoint = { x, y };

    // Start new path
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDrawing || !ctx || !lastPoint) return;

    // Adjust Y coordinate because canvas starts at 56px
    const x = e.clientX;
    const y = e.clientY - 56;

    // Draw line segment immediately
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPoint = { x, y };
  }

  function handlePointerUp() {
    if (isDrawing && ctx) {
      isDrawing = false;
      lastPoint = null;
      // Path is already drawn, no need to store it
    }
  }

  function clearCanvas() {
    if (!canvasElement || !ctx) return;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }

  $effect(() => {
    if (canvasElement && typeof window !== 'undefined') {
      canvasElement.width = window.innerWidth;
      // Canvas starts below header (56px)
      canvasElement.height = window.innerHeight - 56;

      // Initialize context
      ctx = canvasElement.getContext('2d');
    }
  });
</script>

<style>
  .drawing-overlay {
    position: fixed;
    inset: 0;
    z-index: 9998;
    pointer-events: none;
  }

  .drawing-canvas {
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: auto;
    cursor: crosshair;
  }
</style>

<div class="drawing-overlay">
  <canvas
    bind:this={canvasElement}
    class="drawing-canvas"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
  ></canvas>
</div>

