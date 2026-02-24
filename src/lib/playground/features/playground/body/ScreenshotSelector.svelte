<script lang="ts">
  interface Props {
    drawingMode?: boolean;
    drawColor?: string;
  }

  let { drawingMode = false, drawColor = '#ef4444' }: Props = $props();

  // Selection rectangle state
  let isSelecting = $state(false);
  let startX = $state(0);
  let startY = $state(0);
  let currentX = $state(0);
  let currentY = $state(0);
  let selectionFixed = $state(false);

  // Drawing state
  let isDrawing = $state(false);
  let paths: Array<{ points: Array<{ x: number; y: number }>; color: string }> = $state([]);
  let currentPath: Array<{ x: number; y: number }> = $state([]);

  let overlayElement: HTMLDivElement | undefined = $state();
  let canvasElement: HTMLCanvasElement | undefined = $state();

  // Computed selection rectangle
  const rect = $derived({
    x: Math.min(startX, currentX),
    y: Math.min(startY, currentY),
    width: Math.abs(currentX - startX),
    height: Math.abs(currentY - startY)
  });

  function handlePointerDown(e: PointerEvent) {
    if (!drawingMode) {
      // Selection mode
      isSelecting = true;
      selectionFixed = false;
      startX = e.clientX;
      startY = e.clientY;
      currentX = e.clientX;
      currentY = e.clientY;
    } else if (selectionFixed) {
      // Drawing mode - only if selection is fixed
      isDrawing = true;
      currentPath = [{ x: e.clientX, y: e.clientY }];
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (isSelecting && !selectionFixed) {
      currentX = e.clientX;
      currentY = e.clientY;
    } else if (isDrawing && drawingMode) {
      currentPath.push({ x: e.clientX, y: e.clientY });
      drawOnCanvas();
    }
  }

  function handlePointerUp(e: PointerEvent) {
    if (isSelecting && !selectionFixed) {
      currentX = e.clientX;
      currentY = e.clientY;
      isSelecting = false;
      selectionFixed = true;
    } else if (isDrawing) {
      paths.push({ points: [...currentPath], color: drawColor });
      currentPath = [];
      isDrawing = false;
    }
  }

  function drawOnCanvas() {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Draw all saved paths
    paths.forEach(path => {
      if (path.points.length < 2) return;
      ctx.strokeStyle = path.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });

    // Draw current path
    if (currentPath.length > 1) {
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  }

  $effect(() => {
    if (canvasElement && typeof window !== 'undefined') {
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;
    }
  });

  // Redraw when drawing mode changes or color changes
  $effect(() => {
    if (drawingMode || drawColor) {
      drawOnCanvas();
    }
  });
</script>

<style>
  .screenshot-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    cursor: crosshair;
  }

  .selection-rect {
    position: absolute;
    border: 2px dashed var(--playground-accent, #ff6b35);
    background: rgba(255, 107, 53, 0.1);
    pointer-events: none;
  }

  .drawing-canvas {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .drawing-mode {
    cursor: crosshair;
  }
</style>

<div
  bind:this={overlayElement}
  class="screenshot-overlay {drawingMode && selectionFixed ? 'drawing-mode' : ''}"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  style="background: rgba(0, 0, 0, {selectionFixed ? '0.3' : '0.5'});"
>
  <!-- Selection rectangle -->
  {#if (isSelecting || selectionFixed) && rect.width > 5 && rect.height > 5}
    <div
      class="selection-rect"
      style="left: {rect.x}px; top: {rect.y}px; width: {rect.width}px; height: {rect.height}px;"
    ></div>
  {/if}

  <!-- Drawing canvas -->
  {#if selectionFixed && drawingMode}
    <canvas
      bind:this={canvasElement}
      class="drawing-canvas"
      style="pointer-events: {drawingMode ? 'auto' : 'none'};"
    ></canvas>
  {/if}
</div>

