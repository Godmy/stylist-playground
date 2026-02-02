<script lang="ts">
  import { GitBranch, Code, Layers, Package } from 'lucide-svelte';

  type Stats = {
    atoms: number;
    molecules: number;
    organisms: number;
  };

  const { stats }: { stats: Stats } = $props();
</script>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .float-animation {
    animation: float 6s ease-in-out infinite;
  }
</style>

<section class="py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-20">
      <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full mb-6 border-2 border-orange-300 dark:border-orange-700">
        <GitBranch class="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <span class="text-sm font-bold text-orange-900 dark:text-orange-300">Atomic Design</span>
      </div>
      <h2 class="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
        Built on Atomic Principles
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Every component follows the proven Atomic Design methodology
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-10">
      <!-- Atoms -->
      <div class="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl p-10 border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:scale-105 hover:-translate-y-2">
        <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-8 float-animation shadow-lg">
          <Code class="w-12 h-12 text-white" />
        </div>
        <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-4">
          Atoms
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 min-h-[60px]">
          Basic building blocks - buttons, inputs, labels, icons
        </p>
        <div class="text-5xl font-black text-blue-600 dark:text-blue-400">
          {stats.atoms}
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-semibold">components</p>
      </div>

      <!-- Molecules -->
      <div class="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl p-10 border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all hover:scale-105 hover:-translate-y-2" style="animation-delay: 0.1s">
        <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-8 float-animation shadow-lg" style="animation-delay: 1s">
          <Layers class="w-12 h-12 text-white" />
        </div>
        <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-4">
          Molecules
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 min-h-[60px]">
          Combined atoms - search bars, cards, form fields
        </p>
        <div class="text-5xl font-black text-purple-600 dark:text-purple-400">
          {stats.molecules}
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-semibold">components</p>
      </div>

      <!-- Organisms -->
      <div class="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl p-10 border-2 border-green-300 dark:border-green-700 hover:border-green-500 dark:hover:border-green-400 transition-all hover:scale-105 hover:-translate-y-2" style="animation-delay: 0.2s">
        <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-8 float-animation shadow-lg" style="animation-delay: 2s">
          <Package class="w-12 h-12 text-white" />
        </div>
        <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-4">
          Organisms
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 min-h-[60px]">
          Complex components - headers, forms, modals
        </p>
        <div class="text-5xl font-black text-green-600 dark:text-green-400">
          {stats.organisms}
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-semibold">components</p>
      </div>
    </div>
  </div>
</section>
