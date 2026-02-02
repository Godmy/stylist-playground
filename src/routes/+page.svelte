<script lang="ts">
  import Hero from '$playground/components/landing/Hero.svelte';
  import Stats from '$playground/components/landing/Stats.svelte';
  import CtaButtons from '$playground/components/landing/CtaButtons.svelte';
  import AtomicPrinciples from '$playground/components/landing/AtomicPrinciples.svelte';
  import LiveCode from '$playground/components/landing/LiveCode.svelte';
  import Features from '$playground/components/landing/Features.svelte';
  import Mission from '$playground/components/landing/Mission.svelte';

  // Get paths to all story files to calculate stats
  const storyImports = import.meta.glob(
    '../../../stylist-svelte/src/lib/components/**/*.story.svelte'
  );

  const storyPaths = Object.keys(storyImports);
  const totalComponents = storyPaths.length;
  const atoms = storyPaths.filter(path => path.includes('/atoms/')).length;
  const molecules = storyPaths.filter(path => path.includes('/molecules/')).length;
  const organisms = storyPaths.filter(path => path.includes('/organisms/')).length;

  let stats = $state({ totalComponents, atoms, molecules, organisms });

</script>

<div class="space-y-16">
  <Hero />
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <div class="text-center">
      <Stats {stats} />
      <CtaButtons totalComponents={stats.totalComponents} />
    </div>
  </div>

  <AtomicPrinciples {stats} />

  <LiveCode />

  <Features />

  <Mission />
</div>
