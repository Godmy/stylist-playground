<script lang="ts">
  import { Eye, Keyboard, CheckCircle, AlertCircle, Info, Volume2, Palette } from 'lucide-svelte';
  import { playgroundStore } from '../../../state/playground.svelte';

  interface Props {
    componentName?: string;
  }

  let { componentName = '' }: Props = $props();

  // Accessibility check results (in real app, these would be computed)
  const a11yChecks = $state([
    {
      category: 'Color Contrast',
      icon: Palette,
      status: 'pass',
      message: 'All text meets WCAG AA standards (4.5:1 ratio)',
      details: 'Background: #ffffff, Foreground: #1f2937, Ratio: 16.1:1',
      color: 'green'
    },
    {
      category: 'Keyboard Navigation',
      icon: Keyboard,
      status: 'pass',
      message: 'Component is fully keyboard accessible',
      details: 'Tab order is logical, focus states are visible, no keyboard traps detected',
      color: 'green'
    },
    {
      category: 'Screen Reader',
      icon: Volume2,
      status: 'warning',
      message: 'Some elements may need ARIA labels',
      details: 'Consider adding aria-label to icon-only buttons',
      color: 'yellow'
    },
    {
      category: 'Focus Management',
      icon: Eye,
      status: 'pass',
      message: 'Focus indicators are clearly visible',
      details: 'Focus ring has sufficient contrast and size',
      color: 'green'
    },
    {
      category: 'ARIA Attributes',
      icon: Info,
      status: 'warning',
      message: 'Missing some recommended ARIA attributes',
      details: 'Add role="button" to clickable divs, aria-expanded for toggles',
      color: 'yellow'
    }
  ]);

  function getStatusIcon(status: string) {
    return status === 'pass' ? CheckCircle : AlertCircle;
  }

  function getStatusColor(color: string) {
    switch (color) {
      case 'green':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'red':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  }

  function getBorderColor(color: string) {
    switch (color) {
      case 'green':
        return 'border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600';
      case 'yellow':
        return 'border-yellow-300 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-600';
      case 'red':
        return 'border-red-300 dark:border-red-700 hover:border-red-400 dark:hover:border-red-600';
      default:
        return 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600';
    }
  }

  // Calculate overall score
  const passedChecks = $derived(a11yChecks.filter(check => check.status === 'pass').length);
  const totalChecks = $derived(a11yChecks.length);
  const score = $derived(Math.round((passedChecks / totalChecks) * 100));

  function runA11yAudit() {
    playgroundStore.info('Accessibility audit integration is planned in the next refactor step.');
  }

  function fixIssue(check: any) {
    playgroundStore.info(`Fix assistant for "${check.category}" is not implemented yet.`);
  }
</script>

<div class="a11y-panel p-6 h-full overflow-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
  <!-- Header with score -->
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
        Accessibility Audit
      </h3>
      <button
        onclick={runA11yAudit}
        class="group flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 dark:hover:from-indigo-800/40 dark:hover:to-purple-800/40 text-indigo-700 dark:text-indigo-300 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
      >
        <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Re-run Audit
      </button>
    </div>

    <!-- Score card -->
    <div class="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border-2 {score >= 80 ? 'border-green-300 dark:border-green-700' : score >= 60 ? 'border-yellow-300 dark:border-yellow-700' : 'border-red-300 dark:border-red-700'} shadow-lg">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Overall Accessibility Score
          </h4>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-bold {score >= 80 ? 'text-green-600 dark:text-green-400' : score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}">
              {score}%
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              ({passedChecks}/{totalChecks} checks passed)
            </span>
          </div>
        </div>
        <div class="w-24 h-24">
          <svg class="transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              class="text-gray-200 dark:text-gray-700"
              stroke-width="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              class="{score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}"
              stroke-width="8"
              stroke-dasharray="{(score / 100) * 251.2} 251.2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Checks list -->
  <div class="space-y-4">
    <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-3">
      Detailed Checks
    </h4>

    {#each a11yChecks as check, index}
      {@const StatusIcon = getStatusIcon(check.status)}
      {@const CategoryIcon = check.icon}
      <div
        class="check-item bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border-2 {getBorderColor(check.color)} transition-all hover:scale-[1.02] shadow-md hover:shadow-lg"
        style="animation-delay: {index * 50}ms"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0 w-10 h-10 rounded-lg {getStatusColor(check.color)} flex items-center justify-center">
            <CategoryIcon class="w-5 h-5" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h5 class="text-sm font-bold text-gray-900 dark:text-white">
                {check.category}
              </h5>
              <StatusIcon class="w-4 h-4 {check.status === 'pass' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}" />
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {check.message}
            </p>
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
              <p class="text-xs font-mono text-gray-700 dark:text-gray-300">
                {check.details}
              </p>
            </div>
          </div>

          <!-- Fix button -->
          {#if check.status !== 'pass'}
            <button
              onclick={() => fixIssue(check)}
              class="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 text-purple-700 dark:text-purple-300 transition-all hover:scale-105 active:scale-95"
              title="Get fix suggestions"
            >
              Fix
            </button>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Guidelines section -->
  <div class="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
    <h4 class="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
      <Info class="w-4 h-4" />
      WCAG Guidelines
    </h4>
    <ul class="space-y-1.5 text-xs text-indigo-700 dark:text-indigo-300">
      <li class="flex items-start gap-2">
        <span class="text-indigo-500 mt-0.5">вЂў</span>
        <span>Level A: Minimum accessibility (essential)</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-indigo-500 mt-0.5">вЂў</span>
        <span>Level AA: Recommended for most content (4.5:1 contrast)</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-indigo-500 mt-0.5">вЂў</span>
        <span>Level AAA: Enhanced accessibility (7:1 contrast)</span>
      </li>
    </ul>
  </div>

  <!-- Quick actions -->
  <div class="mt-6 grid grid-cols-2 gap-3">
    <button
      class="group p-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
    >
      <div class="flex items-center gap-2">
        <Keyboard class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span class="text-xs font-semibold text-gray-900 dark:text-white">Test Keyboard Nav</span>
      </div>
    </button>
    <button
      class="group p-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
    >
      <div class="flex items-center gap-2">
        <Volume2 class="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span class="text-xs font-semibold text-gray-900 dark:text-white">Test Screen Reader</span>
      </div>
    </button>
  </div>
</div>

<style>
  .check-item {
    animation: fade-slide-in 0.3s ease-out;
  }

  @keyframes fade-slide-in {
    from {
      opacity: 0;
      transform: translateX(-12px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .a11y-panel {
    animation: fade-in 0.3s ease-out;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

