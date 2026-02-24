<script lang="ts">
  import { onMount } from 'svelte';
  import { Check } from 'lucide-svelte';

  interface Props {
    message: string;
    duration?: number;
    onClose?: () => void;
  }

  let { message, duration = 3000, onClose }: Props = $props();

  onMount(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  });
</script>

<style>
  .toast {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>

<div class="toast fixed top-20 right-4 z-[10000] bg-green-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
  <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
    <Check class="w-4 h-4" />
  </div>
  <p class="text-sm font-medium flex-1">{message}</p>
</div>

