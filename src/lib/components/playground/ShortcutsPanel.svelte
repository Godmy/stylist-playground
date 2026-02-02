<script lang="ts">
  import { Keyboard, Command, Search, Zap, Eye, Sidebar as SidebarIcon, Layout, Grid, Moon, Code, Copy } from 'lucide-svelte';

  interface Shortcut {
    keys: string[];
    description: string;
    category: string;
    icon?: any;
  }

  const shortcuts: Shortcut[] = [
    // Navigation
    { keys: ['Ctrl', '/'], description: 'Toggle Sidebar', category: 'Navigation', icon: SidebarIcon },
    { keys: ['Ctrl', 'B'], description: 'Toggle Bottom Panel', category: 'Navigation', icon: Layout },
    { keys: ['Ctrl', 'K'], description: 'Open Command Palette', category: 'Navigation', icon: Command },
    { keys: ['Ctrl', 'P'], description: 'Quick Search Components', category: 'Navigation', icon: Search },

    // View Controls
    { keys: ['Ctrl', 'G'], description: 'Toggle Grid', category: 'View', icon: Grid },
    { keys: ['Ctrl', 'D'], description: 'Toggle Dark Mode', category: 'View', icon: Moon },
    { keys: ['Ctrl', '+'], description: 'Zoom In', category: 'View', icon: Eye },
    { keys: ['Ctrl', '-'], description: 'Zoom Out', category: 'View', icon: Eye },
    { keys: ['Ctrl', '0'], description: 'Reset Zoom', category: 'View', icon: Eye },

    // Actions
    { keys: ['Ctrl', 'C'], description: 'Copy Code', category: 'Actions', icon: Copy },
    { keys: ['Ctrl', 'E'], description: 'Export Component', category: 'Actions', icon: Code },
    { keys: ['Ctrl', 'R'], description: 'Reset All Props', category: 'Actions', icon: Zap },
    { keys: ['Ctrl', 'S'], description: 'Save Variant', category: 'Actions', icon: Zap },

    // Viewport
    { keys: ['Alt', '1'], description: 'Mobile Viewport', category: 'Viewport', icon: Layout },
    { keys: ['Alt', '2'], description: 'Tablet Viewport', category: 'Viewport', icon: Layout },
    { keys: ['Alt', '3'], description: 'Desktop Viewport', category: 'Viewport', icon: Layout },
    { keys: ['Alt', '4'], description: 'Fullscreen Viewport', category: 'Viewport', icon: Layout },

    // Tabs
    { keys: ['Ctrl', '1'], description: 'Go to Controls Tab', category: 'Tabs', icon: Layout },
    { keys: ['Ctrl', '2'], description: 'Go to Code Tab', category: 'Tabs', icon: Layout },
    { keys: ['Ctrl', '3'], description: 'Go to Actions Tab', category: 'Tabs', icon: Layout },
    { keys: ['Ctrl', '4'], description: 'Go to Variants Tab', category: 'Tabs', icon: Layout },

    // Misc
    { keys: ['?'], description: 'Show Shortcuts Panel', category: 'Misc', icon: Keyboard },
    { keys: ['Esc'], description: 'Close Modals/Panels', category: 'Misc', icon: Keyboard },
  ];

  // Group shortcuts by category
  const groupedShortcuts = $derived.by(() => {
    const groups = new Map<string, Shortcut[]>();
    shortcuts.forEach(shortcut => {
      if (!groups.has(shortcut.category)) {
        groups.set(shortcut.category, []);
      }
      groups.get(shortcut.category)!.push(shortcut);
    });
    return groups;
  });

  const categoryOrder = ['Navigation', 'View', 'Actions', 'Viewport', 'Tabs', 'Misc'];

  function getCategoryIcon(category: string) {
    switch (category) {
      case 'Navigation': return SidebarIcon;
      case 'View': return Eye;
      case 'Actions': return Zap;
      case 'Viewport': return Layout;
      case 'Tabs': return Layout;
      case 'Misc': return Keyboard;
      default: return Keyboard;
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'Navigation': return 'from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-800';
      case 'View': return 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800';
      case 'Actions': return 'from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200 dark:border-orange-800';
      case 'Viewport': return 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800';
      case 'Tabs': return 'from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800';
      case 'Misc': return 'from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 border-gray-200 dark:border-gray-800';
      default: return 'from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 border-gray-200 dark:border-gray-800';
    }
  }

  function getKeyColor(key: string) {
    if (key === 'Ctrl' || key === 'Alt' || key === 'Shift') {
      return 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
    }
    return 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600';
  }
</script>

<div class="shortcuts-panel p-6 h-full overflow-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
  <!-- Header -->
  <div class="mb-6">
    <div class="flex items-center gap-3 mb-2">
      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
        <Keyboard class="w-6 h-6 text-white" />
      </div>
      <h3 class="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
        Keyboard Shortcuts
      </h3>
    </div>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Master the playground with these keyboard shortcuts
    </p>
  </div>

  <!-- Shortcuts by category -->
  <div class="space-y-6">
    {#each categoryOrder as category}
      {#if groupedShortcuts.has(category)}
        {@const categoryShortcuts = groupedShortcuts.get(category) || []}
        {@const CategoryIcon = getCategoryIcon(category)}
        <div class="category-section">
          <!-- Category header -->
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br {getCategoryColor(category)} flex items-center justify-center border-2">
              <CategoryIcon class="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">
              {category}
            </h4>
            <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold">
              {categoryShortcuts.length}
            </span>
          </div>

          <!-- Shortcuts list -->
          <div class="space-y-2 ml-10">
            {#each categoryShortcuts as shortcut, index}
              <div
                class="shortcut-item group p-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                style="animation-delay: {index * 30}ms"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    {#if shortcut.icon}
                      {@const Icon = shortcut.icon}
                      <Icon class="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    {/if}
                    <span class="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                      {shortcut.description}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    {#each shortcut.keys as key, i}
                      <kbd class="px-2.5 py-1 rounded text-xs font-bold {getKeyColor(key)} border shadow-sm font-mono transition-all group-hover:scale-105">
                        {key}
                      </kbd>
                      {#if i < shortcut.keys.length - 1}
                        <span class="text-gray-400 dark:text-gray-600 text-xs mx-0.5">+</span>
                      {/if}
                    {/each}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <!-- Tips section -->
  <div class="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
    <h4 class="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
      <Zap class="w-4 h-4" />
      Pro Tips
    </h4>
    <ul class="space-y-1.5 text-xs text-indigo-700 dark:text-indigo-300">
      <li class="flex items-start gap-2">
        <span class="text-indigo-500 mt-0.5">•</span>
        <span>Hold <kbd class="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border border-indigo-300 dark:border-indigo-700 font-mono text-[10px]">Shift</kbd> while using zoom shortcuts for finer control</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-indigo-500 mt-0.5">•</span>
        <span>Press <kbd class="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border border-indigo-300 dark:border-indigo-700 font-mono text-[10px]">?</kbd> anytime to open this shortcuts panel</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-indigo-500 mt-0.5">•</span>
        <span>Use <kbd class="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border border-indigo-300 dark:border-indigo-700 font-mono text-[10px]">Esc</kbd> to close any modal or panel</span>
      </li>
    </ul>
  </div>

  <!-- Platform note -->
  <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
      On macOS, replace <kbd class="px-1 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono">Ctrl</kbd> with <kbd class="px-1 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono">⌘</kbd> (Command)
    </p>
  </div>
</div>

<style>
  .shortcut-item {
    animation: fade-slide-in 0.3s ease-out;
  }

  @keyframes fade-slide-in {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .category-section {
    animation: fade-in 0.4s ease-out;
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