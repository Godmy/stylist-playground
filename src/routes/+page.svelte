<script lang="ts">
  import { ArrowRight, Package, Layers, Code, Sparkles, GitBranch, Users, Zap, Play, ExternalLink, Heart } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import CodeViewer from '$lib/components/CodeViewer.svelte';

  // Get paths to all story files
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

  let stats = $state({ totalComponents, atoms, molecules, organisms });

  // Animated stats
  let animatedStats = $state({ totalComponents: 0, atoms: 0, molecules: 0, organisms: 0 });
  let statsVisible = $state(false);

  // Example code for live preview
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

  // AI Models with links
  const aiModels = [
    {
      name: 'Claude',
      url: 'https://claude.ai',
      logo: '/logos/claude.png',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'By Anthropic'
    },
    {
      name: 'Codex',
      url: 'https://openai.com',
      logo: '/logos/openai.png',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'By OpenAI'
    },
    {
      name: 'Gemini',
      url: 'https://gemini.google.com',
      logo: '/logos/gemini.png',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'By Google'
    },
    {
      name: 'Qwen',
      url: 'https://github.com/QwenLM',
      logo: '/logos/qwen.png',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'By Alibaba'
    },
  ];

  // Featured components showcase
  const featuredComponents = [
    { name: 'Button', category: 'Atoms', description: 'Versatile button with multiple variants' },
    { name: 'Card', category: 'Molecules', description: 'Flexible card container' },
    { name: 'Modal', category: 'Organisms', description: 'Full-featured modal dialog' },
    { name: 'Form', category: 'Organisms', description: 'Complete form with validation' },
  ];

  let currentFeature = $state(0);

  // Animated atomic design nodes
  let atomicAnimation = $state({ scale: 1, rotate: 0 });

  onMount(() => {
    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statsVisible = true;
          animateStats();
        }
      });
    });

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);

    // Rotate featured components
    const interval = setInterval(() => {
      currentFeature = (currentFeature + 1) % featuredComponents.length;
    }, 3000);

    // Animate atomic design
    const atomicInterval = setInterval(() => {
      atomicAnimation = {
        scale: 1 + Math.sin(Date.now() / 1000) * 0.05,
        rotate: (Date.now() / 50) % 360
      };
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(atomicInterval);
    };
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

<style>
  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(249, 115, 22, 0.6);
    }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .gradient-bg {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
  }

  .float-animation {
    animation: float 6s ease-in-out infinite;
  }

  .pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .slide-up {
    animation: slide-up 0.6s ease-out forwards;
  }

  @keyframes rotate-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rotate-slow {
    animation: rotate-slow 20s linear infinite;
  }

  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    10%, 30% {
      transform: scale(1.2);
    }
    20%, 40% {
      transform: scale(1.1);
    }
  }

  @keyframes pulse-heart {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    50% {
      box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
    }
  }

  .heartbeat {
    display: inline-block;
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  .pulse-heart {
    animation: pulse-heart 1.5s ease-in-out infinite;
  }

  :global(.heart-icon) {
    display: inline-block;
    animation: heartbeat 1.5s ease-in-out infinite;
  }
</style>

<!-- Hero Section with Animated Background -->
<div class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Animated gradient background -->
  <div class="absolute inset-0 gradient-bg opacity-10"></div>

  <!-- Floating particles -->
  <div class="absolute inset-0 overflow-hidden">
    {#each Array(20) as _, i}
      <div
        class="absolute rounded-full bg-orange-500/20"
        style="
          width: {Math.random() * 100 + 20}px;
          height: {Math.random() * 100 + 20}px;
          left: {Math.random() * 100}%;
          top: {Math.random() * 100}%;
          animation: float {Math.random() * 10 + 5}s ease-in-out infinite;
          animation-delay: {Math.random() * 5}s;
        "
      ></div>
    {/each}
  </div>

  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
    <!-- Hero Content -->
    <div class="text-center mb-12">
      <!-- Main Title -->
      <div class="mb-6 slide-up" style="animation-delay: 0.1s">
        <h1 class="text-7xl md:text-8xl lg:text-9xl font-black mb-4 leading-tight text-gray-900 dark:text-white">
          Stylist
        </h1>
      </div>

      <!-- AI Badge -->
      <div class="slide-up mb-8" style="animation-delay: 0.2s">
        <a
          href="https://www.npmjs.com/package/stylist-svelte"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-full border-2 border-orange-300 dark:border-orange-700 pulse-glow hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-xl transition-all hover:scale-105"
        >
          <Sparkles class="w-6 h-6 text-orange-600 group-hover:rotate-12 transition-transform" />
          <span class="text-lg font-bold text-orange-900 dark:text-orange-300">AI-Generated Component Library</span>
          <ExternalLink class="w-5 h-5 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      <div class="slide-up mb-6" style="animation-delay: 0.3s">
        <p class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          The world's largest Svelte 5 component library
        </p>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Created by the <span class="font-bold text-indigo-600 dark:text-indigo-400">Vibe-Management Team</span>
        </p>
      </div>

      <div class="slide-up max-w-3xl mx-auto mb-12" style="animation-delay: 0.4s">
        <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed text-center">
          <strong class="text-gray-900 dark:text-white">OMG! This is Godmy</strong>, the product owner of the <strong>Vibe-Management team</strong> —
          a collective of leading LLM models.
          We have created the <span class="text-orange-600 dark:text-orange-400 font-bold">Stylist-Svelte-Coder-Model</span> —
          a unified AI model specifically trained for Svelte 5 using atomic design principles.
          Attention, designed for those who love Svelte
          <span class="heart-icon align-middle ml-1">
            <Heart class="w-5 h-5 text-red-500" style="fill: currentColor;" />
          </span>
        </p>
      </div>

      <!-- AI Models Showcase -->
      <div class="slide-up mb-16" style="animation-delay: 0.5s">
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-6">
          Powered by Leading AI Models
        </p>
        <div class="flex flex-wrap items-center justify-center gap-6">
          {#each aiModels as model, i}
            <a
              href={model.url}
              target="_blank"
              rel="noopener noreferrer"
              class="group px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:scale-110 hover:-translate-y-2"
              style="animation-delay: {0.6 + i * 0.1}s"
            >
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl {model.bgColor} p-2 flex items-center justify-center shadow-md group-hover:shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3">
                  <img
                    src={model.logo}
                    alt="{model.name} logo"
                    class="w-full h-full object-contain"
                  />
                </div>
                <div class="text-left">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-gray-900 dark:text-white transition-all">
                      {model.name}
                    </span>
                    <ArrowRight class="w-4 h-4 text-orange-500 dark:text-orange-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {model.description}
                  </span>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </div>

      <!-- Stats -->
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

      <!-- CTA Buttons -->
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
            Explore {stats.totalComponents} AI-generated production-ready components
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
    </div>
  </div>
</div>

<!-- Atomic Design Visualization -->
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

<!-- Live Code Preview -->
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

<!-- Features Grid -->
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

<!-- Mission & Call to Action -->
<section class="py-24 bg-gradient-to-br from-orange-600 via-red-600 to-purple-600 text-white">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full mb-8">
      <Sparkles class="w-5 h-5" />
      <span class="text-sm font-bold">Our Mission</span>
    </div>

    <h2 class="text-5xl md:text-6xl font-black mb-8 leading-tight">
      Building the Future of<br/>Component Libraries
    </h2>

    <p class="text-2xl mb-12 leading-relaxed opacity-90">
      To create the world's largest library of visual components for Svelte 5 developers.
      Every release expands this AI-curated collection, enabling teams to build consistent
      user interfaces faster with components designed by collective intelligence.
    </p>

    <div class="flex flex-wrap gap-6 justify-center">
      <a
        href="/components"
        class="px-10 py-5 bg-white text-gray-900 font-black text-xl rounded-2xl hover:shadow-2xl hover:scale-105 transition-all"
      >
        Explore Components
      </a>
      <a
        href="/playground"
        class="px-10 py-5 bg-transparent border-4 border-white text-white font-black text-xl rounded-2xl hover:bg-white hover:text-gray-900 hover:shadow-2xl hover:scale-105 transition-all"
      >
        Try Playground
      </a>
    </div>
  </div>
</section>
