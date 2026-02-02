<script lang="ts">
  import { onMount } from 'svelte';

  type Stats = {
    totalComponents: number;
    atoms: number;
    molecules: number;
    organisms: number;
  };

  const { stats }: { stats: Stats } = $props();

  let animatedStats = $state({ totalComponents: 0, atoms: 0, molecules: 0, organisms: 0 });
  let statsVisible = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!statsVisible) {
            statsVisible = true;
            animateStats();
          }
        }
      });
    });

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);
  });

  function animateStats() {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      animatedStats = {
        totalComponents: Math.floor(stats.totalComponents * easeProgress),
        atoms: Math.floor(stats.atoms * easeProgress),
        molecules: Math.floor(stats.molecules * easeProgress),
        organisms: Math.floor(stats.organisms * easeProgress)
      };

      currentStep++;

      if (currentStep > steps) {
        clearInterval(interval);
        animatedStats = stats;
      }
    }, stepDuration);
  }
</script>

<div id="stats-section" class="slide-up mb-20" style="animation-delay: 0.7s">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border-2 border-orange-300 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-400 hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer">
      <div class="text-5xl font-black text-orange-600 dark:text-orange-400 mb-2">
        {animatedStats.totalComponents}
      </div>
      <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Components
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer">
      <div class="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">
        {animatedStats.atoms}
      </div>
      <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Atoms
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-400 hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer">
      <div class="text-5xl font-black text-purple-600 dark:text-purple-400 mb-2">
        {animatedStats.molecules}
      </div>
      <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Molecules
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border-2 border-green-300 dark:border-green-700 hover:border-green-500 dark:hover:border-green-400 hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer">
      <div class="text-5xl font-black text-green-600 dark:text-green-400 mb-2">
        {animatedStats.organisms}
      </div>
      <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Organisms
      </div>
    </div>
  </div>
</div>
