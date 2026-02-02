<script lang="ts">
  import { Play, ArrowRight } from 'lucide-svelte';
  import CodeViewer from '$playground/components/CodeViewer.svelte';
  
  const exampleCode = `<script lang="ts">
  import { Button } from '@stylist/components';

  let count = $state(0);
<\/script>

<div class="space-y-4">
  <h2 class="text-2xl font-bold">
    Count: {count}
  </h2>

  <Button
    variant="primary"
    onclick={() => count++}
  >
    Increment
  </Button>
</div>`;
</script>

<section class="py-24 bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
        <Play class="w-5 h-5 text-orange-600" />
        <span class="text-sm font-bold text-orange-900 dark:text-orange-300">Live Preview</span>
      </div>
      <h2 class="text-5xl font-black text-white mb-4">
        See It In Action
      </h2>
      <p class="text-xl text-gray-400 max-w-2xl mx-auto">
        Every component comes with ready-to-use code
      </p>
    </div>

    <div class="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
      <CodeViewer code={exampleCode} language="svelte" />
    </div>

    <div class="text-center mt-12">
      <a
        href="/playground"
        class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105"
      >
        <Play class="w-6 h-6" />
        Try in Playground
        <ArrowRight class="w-6 h-6" />
      </a>
    </div>
  </div>
</section>
