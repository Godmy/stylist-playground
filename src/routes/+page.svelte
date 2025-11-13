<script lang="ts">
  import { ArrowRight, Package, Layers, Palette } from 'lucide-svelte';

  // Get paths to all story files (don't load them, just enumerate)
  const storyImports = import.meta.glob(
    '../../../stylist-svelte/src/lib/components/**/*.story.svelte'
  );

  // Count stories by extracting metadata from file paths
  const storyPaths = Object.keys(storyImports);
  const totalComponents = storyPaths.length;

  // Categorize by path
  const atoms = storyPaths.filter(path => path.includes('/atoms/')).length;
  const molecules = storyPaths.filter(path => path.includes('/molecules/')).length;
  const organisms = storyPaths.filter(path => path.includes('/organisms/')).length;

  const stats = { totalComponents, atoms, molecules, organisms };
</script>

<style>
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }

</style>

<!-- Hero Section -->
<div class="min-h-screen flex items-center justify-center py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <!-- Hero Content -->
    <div class="text-center mb-16">
      <!-- Main Title -->
      <h1 class="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight text-gray-900 dark:text-white">
        Stylist
      </h1>

      <!-- AI Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-full border border-orange-200 dark:border-orange-800 mb-6">
        <span class="text-2xl">🤖</span>
        <span class="text-sm font-semibold text-orange-900 dark:text-orange-300">AI-Generated Component Library</span>
      </div>

      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
        The world's largest Svelte 5 component library<br/>built by collective AI intelligence
      </p>

      <p class="text-base text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
        Developed by leading LLM models (Claude, Codex, Gemini, Qwen) using the vibe-management role model.
        Every component is crafted by <strong>Stylist-coder-model</strong> — a combined AI trained specifically for Svelte 5.
      </p>

      <!-- Stats -->
      <div class="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span class="text-3xl font-bold text-gray-900 dark:text-white block mb-1">{stats.totalComponents}</span>
          <span>Components</span>
        </div>
        <div class="text-gray-300 dark:text-gray-700">•</div>
        <div>
          <span class="text-3xl font-bold text-gray-900 dark:text-white block mb-1">{stats.atoms}</span>
          <span>Atoms</span>
        </div>
        <div class="text-gray-300 dark:text-gray-700">•</div>
        <div>
          <span class="text-3xl font-bold text-gray-900 dark:text-white block mb-1">{stats.molecules}</span>
          <span>Molecules</span>
        </div>
        <div class="text-gray-300 dark:text-gray-700">•</div>
        <div>
          <span class="text-3xl font-bold text-gray-900 dark:text-white block mb-1">{stats.organisms}</span>
          <span>Organisms</span>
        </div>
      </div>
    </div>

    <!-- CTA Buttons -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
      <a
        href="/components"
        class="group bg-gray-900 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 hover:scale-[1.02]"
      >
        <div class="flex items-center justify-between mb-4">
          <Package class="w-10 h-10 text-white" />
          <ArrowRight class="w-6 h-6 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">
          Browse Components
        </h3>
        <p class="text-gray-400">
          Explore {stats.totalComponents} AI-generated production-ready components
        </p>
      </a>

      <a
        href="/playground"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-all duration-300 hover:scale-[1.02]"
      >
        <div class="flex items-center justify-between mb-4">
          <Layers class="w-10 h-10 text-gray-900 dark:text-white" />
          <ArrowRight class="w-6 h-6 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Interactive Playground
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Test components with live controls and code generation
        </p>
      </a>
    </div>

    <!-- Tech Stack & Mission -->
    <div class="max-w-6xl mx-auto space-y-12">
      <!-- Tech Stack -->
      <div>
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center mb-6">Built with modern technologies</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="text-2xl mb-2">⚡</div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">Svelte 5 Runes</div>
          </div>
          <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="text-2xl mb-2">🔷</div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">TypeScript</div>
          </div>
          <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="text-2xl mb-2">🎨</div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">Atomic Design</div>
          </div>
          <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="text-2xl mb-2">💨</div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">Tailwind CSS</div>
          </div>
        </div>
      </div>

      <!-- Mission Statement -->
      <div class="text-center max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-200 dark:border-orange-800 mb-4">
          <span class="text-sm font-semibold text-orange-900 dark:text-orange-300">Our Mission</span>
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          To create the world's largest library of visual components for Svelte 5 developers.
          Every release expands this AI-curated collection, enabling teams to build consistent
          user interfaces faster with components designed by collective intelligence.
        </p>
      </div>
    </div>
  </div>
</div>
