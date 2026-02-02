<script lang="ts">
  import { Sparkles, Zap, GitBranch, Code, Layers, Users } from 'lucide-svelte';
</script>

<section class="py-24 bg-white dark:bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-black text-gray-900 dark:text-white mb-4">
        Why Stylist?
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        The most advanced AI-generated component library
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-8 border-2 border-orange-200 dark:border-orange-800">
        <div class="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
          <Sparkles class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          AI-Generated
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Every component is crafted by advanced AI models trained specifically for Svelte 5
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
        <div class="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
          <Zap class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Production Ready
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Fully typed, tested, and optimized for real-world applications
        </p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
        <div class="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
          <GitBranch class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Atomic Design
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Organized following proven Atomic Design methodology
        </p>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800">
        <div class="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
          <Code class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Svelte 5 Runes
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Built with the latest Svelte 5 features and best practices
        </p>
      </div>

      <div class="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border-2 border-yellow-200 dark:border-yellow-800">
        <div class="w-16 h-16 bg-yellow-600 rounded-xl flex items-center justify-center mb-6">
          <Layers class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Interactive Playground
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Test and customize every component in real-time
        </p>
      </div>

      <div class="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800">
        <div class="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
          <Users class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Open Source
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Free to use, modify, and contribute to the growing library
        </p>
      </div>
    </div>
  </div>
</section>
