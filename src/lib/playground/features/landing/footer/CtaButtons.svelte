<script lang="ts">
  import { Package, Layers, ArrowRight } from 'lucide-svelte';
  
  const { totalComponents }: { totalComponents: number } = $props();
</script>

<div class="slide-up grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" style="animation-delay: 0.8s">
  <a
    href="/components"
    class="group relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div class="relative flex items-center justify-between mb-4">
      <Package class="w-12 h-12 text-white drop-shadow-lg" />
      <ArrowRight class="w-8 h-8 text-white/70 group-hover:text-white group-hover:translate-x-3 transition-all" />
    </div>
    <h3 class="relative text-3xl font-black text-white mb-3">
      Browse Components
    </h3>
    <p class="relative text-orange-50">
      Explore {totalComponents} AI-generated production-ready components
    </p>
  </a>

  <a
    href="/playground"
    class="group relative bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div class="relative flex items-center justify-between mb-4">
      <Layers class="w-12 h-12 text-white drop-shadow-lg" />
      <ArrowRight class="w-8 h-8 text-white/70 group-hover:text-white group-hover:translate-x-3 transition-all" />
    </div>
    <h3 class="relative text-3xl font-black text-white mb-3">
      Interactive Playground
    </h3>
    <p class="relative text-purple-50">
      Test components with live controls and code generation
    </p>
  </a>
</div>
