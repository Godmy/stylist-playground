<script lang="ts">
  import { Search, Command as CommandIcon, X, Zap, Eye, Grid, Moon, Sun, Layers, Code, Download, Keyboard, FileCode, Star, Clock, Box, Smartphone } from 'lucide-svelte';
  import { playgroundStore } from '../../../state/playground.svelte';
  import type { StoryConfig } from '../../../types';
  import type { Preset } from '../../../utils/presets';
  import type { HistoryEntry } from '../../../utils/history';

  interface Props {
    isOpen?: boolean;
    onClose?: () => void;
    stories?: any[];
  }

  let { isOpen = false, onClose = () => {}, stories = [] }: Props = $props();

  let searchQuery = $state('');
  let selectedIndex = $state(0);
  let inputElement: HTMLInputElement | null = $state(null);

  interface Command {
    id: string;
    title: string;
    description: string;
    icon: any;
    action: () => void;
    category: string;
    keywords?: string[];
  }

  const commands: Command[] = [
    // Navigation
    {
      id: 'toggle-sidebar',
      title: 'Toggle Sidebar',
      description: 'Show or hide the sidebar panel',
      icon: Layers,
      action: () => playgroundStore.toggleSidebar(),
      category: 'Navigation',
      keywords: ['panel', 'menu']
    },
    {
      id: 'toggle-bottom',
      title: 'Toggle Bottom Panel',
      description: 'Show or hide the bottom panel',
      icon: Layers,
      action: () => playgroundStore.toggleBottomPanel(),
      category: 'Navigation'
    },

    // View
    {
      id: 'toggle-grid',
      title: 'Toggle Grid',
      description: 'Show or hide the alignment grid',
      icon: Grid,
      action: () => playgroundStore.toggleGrid(),
      category: 'View',
      keywords: ['alignment', 'guides']
    },
    {
      id: 'toggle-dark',
      title: 'Toggle Dark Mode',
      description: 'Switch between light and dark themes',
      icon: playgroundStore.state.darkMode ? Sun : Moon,
      action: () => playgroundStore.toggleDarkMode(),
      category: 'View',
      keywords: ['theme', 'appearance']
    },
    {
      id: 'zoom-in',
      title: 'Zoom In',
      description: 'Increase canvas zoom level',
      icon: Eye,
      action: () => playgroundStore.zoomIn(),
      category: 'View'
    },
    {
      id: 'zoom-out',
      title: 'Zoom Out',
      description: 'Decrease canvas zoom level',
      icon: Eye,
      action: () => playgroundStore.zoomOut(),
      category: 'View'
    },
    {
      id: 'reset-zoom',
      title: 'Reset Zoom',
      description: 'Reset zoom to 100%',
      icon: Eye,
      action: () => playgroundStore.resetZoom(),
      category: 'View'
    },

    // Tabs
    {
      id: 'tab-controls',
      title: 'Open Controls Tab',
      description: 'Switch to controls panel',
      icon: Layers,
      action: () => {
        playgroundStore.setBottomTab('controls');
        if (!playgroundStore.uiState.bottomPanelOpen) playgroundStore.toggleBottomPanel();
      },
      category: 'Tabs',
      keywords: ['props', 'settings']
    },
    {
      id: 'tab-code',
      title: 'Open Code Tab',
      description: 'View generated code',
      icon: Code,
      action: () => {
        playgroundStore.setBottomTab('code');
        if (!playgroundStore.uiState.bottomPanelOpen) playgroundStore.toggleBottomPanel();
      },
      category: 'Tabs'
    },
    {
      id: 'tab-export',
      title: 'Open Export Tab',
      description: 'Export component in various formats',
      icon: Download,
      action: () => {
        playgroundStore.setBottomTab('export');
        if (!playgroundStore.uiState.bottomPanelOpen) playgroundStore.toggleBottomPanel();
      },
      category: 'Tabs'
    },
    {
      id: 'tab-shortcuts',
      title: 'Open Shortcuts Tab',
      description: 'View all keyboard shortcuts',
      icon: Keyboard,
      action: () => {
        playgroundStore.setBottomTab('shortcuts');
        if (!playgroundStore.uiState.bottomPanelOpen) playgroundStore.toggleBottomPanel();
      },
      category: 'Tabs'
    },
    {
      id: 'tab-presets',
      title: 'Open Presets Tab',
      description: 'Manage and load saved presets',
      icon: Star,
      action: () => {
        playgroundStore.setBottomTab('presets');
        if (!playgroundStore.uiState.bottomPanelOpen) playgroundStore.toggleBottomPanel();
      },
      category: 'Tabs',
      keywords: ['favorites', 'saved']
    },
    {
      id: 'sidebar-history',
      title: 'Open History Sidebar',
      description: 'View recent and most visited components',
      icon: Clock,
      action: () => {
        playgroundStore.setSidebarTab('history');
        if (!playgroundStore.state.sidebarOpen) playgroundStore.toggleSidebar();
      },
      category: 'Tabs',
      keywords: ['recent', 'visited', 'tracking']
    },

    // Viewport
    {
      id: 'viewport-mobile',
      title: 'Mobile Viewport',
      description: 'Switch to mobile view (375px)',
      icon: Layers,
      action: () => playgroundStore.setViewport('mobile'),
      category: 'Viewport',
      keywords: ['phone', 'responsive']
    },
    {
      id: 'viewport-tablet',
      title: 'Tablet Viewport',
      description: 'Switch to tablet view (768px)',
      icon: Layers,
      action: () => playgroundStore.setViewport('tablet'),
      category: 'Viewport',
      keywords: ['ipad', 'responsive']
    },
    {
      id: 'viewport-desktop',
      title: 'Desktop Viewport',
      description: 'Switch to desktop view (1440px)',
      icon: Layers,
      action: () => playgroundStore.setViewport('desktop'),
      category: 'Viewport',
      keywords: ['monitor', 'responsive']
    },
    {
      id: 'viewport-fullscreen',
      title: 'Fullscreen Viewport',
      description: 'Switch to fullscreen view',
      icon: Layers,
      action: () => playgroundStore.setViewport('fullscreen'),
      category: 'Viewport',
      keywords: ['full', 'responsive']
    },

    // Device Frame
    {
      id: 'toggle-device-frame',
      title: 'Toggle Device Frame',
      description: 'Show or hide realistic device frames',
      icon: Smartphone,
      action: () => playgroundStore.toggleDeviceFrame(),
      category: 'View',
      keywords: ['phone', 'mobile', 'tablet', 'mockup']
    }
  ];

  // Dynamic commands from stories, presets, and history
  const dynamicCommands = $derived.by(() => {
    const dynamic: Command[] = [];

    // Add stories/components
    try {
      const allStories = Array.from(playgroundStore.stories.values());
      allStories.forEach((story: StoryConfig) => {
        if (story && story.id && story.title) {
          dynamic.push({
            id: `story-${story.id}`,
            title: story.title,
            description: story.description || `Open ${story.title} component`,
            icon: Box,
            action: () => playgroundStore.setCurrentStory(story.id),
            category: 'Components',
            keywords: [story.category || '', ...(story.tags || [])]
          });
        }
      });
    } catch (error) {
      console.warn('Error loading stories for command palette:', error);
    }

    // Add favorite presets
    try {
      const favoritePresets = playgroundStore.getFavoritePresets();
      favoritePresets.forEach((preset: Preset) => {
        const story = playgroundStore.stories.get(preset.storyId);
        if (story && preset.id && preset.name) {
          dynamic.push({
            id: `preset-${preset.id}`,
            title: `Load Preset: ${preset.name}`,
            description: `Apply preset for ${story.title}`,
            icon: Star,
            action: () => playgroundStore.loadPreset(preset.id),
            category: 'Presets',
            keywords: ['favorite', 'saved', story.title]
          });
        }
      });
    } catch (error) {
      console.warn('Error loading presets for command palette:', error);
    }

    // Add recent history
    try {
      const recentHistory = playgroundStore.getRecentHistory(5);
      recentHistory.forEach((entry: HistoryEntry) => {
        const story = playgroundStore.stories.get(entry.storyId);
        if (story && entry.storyId) {
          dynamic.push({
            id: `history-${entry.storyId}`,
            title: `Recent: ${story.title}`,
            description: `Visited ${formatRelativeTime(entry.timestamp)}`,
            icon: Clock,
            action: () => playgroundStore.setCurrentStory(entry.storyId),
            category: 'Recent',
            keywords: ['history', 'visited']
          });
        }
      });
    } catch (error) {
      console.warn('Error loading history for command palette:', error);
    }

    return dynamic;
  });

  // Combined commands
  const allCommands = $derived([...commands, ...dynamicCommands]);

  // Fuzzy search
  const filteredCommands = $derived.by(() => {
    if (!searchQuery.trim()) return allCommands;

    const query = searchQuery.toLowerCase();
    return allCommands.filter(cmd => {
      const titleMatch = cmd.title.toLowerCase().includes(query);
      const descMatch = cmd.description.toLowerCase().includes(query);
      const categoryMatch = cmd.category.toLowerCase().includes(query);
      const keywordsMatch = cmd.keywords?.some(kw => kw.toLowerCase().includes(query));

      return titleMatch || descMatch || categoryMatch || keywordsMatch;
    });
  });

  function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  }

  // Group by category
  const groupedCommands = $derived.by(() => {
    const groups = new Map<string, Command[]>();

    filteredCommands.forEach(cmd => {
      if (!groups.has(cmd.category)) {
        groups.set(cmd.category, []);
      }
      groups.get(cmd.category)!.push(cmd);
    });

    return groups;
  });

  function executeCommand(command: Command) {
    command.action();
    onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  $effect(() => {
    if (isOpen && inputElement) {
      inputElement.focus();
      selectedIndex = 0;
    }
  });

  $effect(() => {
    // Reset selected index when search changes
    selectedIndex = 0;
  });
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    role="button"
    tabindex="0"
    aria-label="Close command palette"
  ></div>

  <!-- Command Palette -->
  <div class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
    <div
      class="command-palette w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden pointer-events-auto animate-scale-in"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
      tabindex="-1"
    >
      <!-- Search input -->
      <div class="flex items-center gap-3 p-4 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <h2 class="sr-only" id="command-palette-title">Command Palette</h2>
        <Search class="w-5 h-5 text-gray-400" />
        <input
          bind:this={inputElement}
          bind:value={searchQuery}
          onkeydown={handleKeydown}
          type="text"
          placeholder="Type a command or search..."
          class="flex-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base"
        />
        <div class="flex items-center gap-2">
          <kbd class="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
            ESC
          </kbd>
          <button
            onclick={onClose}
            class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X class="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- Results -->
      <div class="max-h-[60vh] overflow-y-auto">
        {#if filteredCommands.length === 0}
          <div class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Search class="w-8 h-8 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              No commands found for "{searchQuery}"
            </p>
          </div>
        {:else}
          {#each [...groupedCommands.entries()] as [category, cmds], groupIndex}
            <div class="category-group">
              <!-- Category header -->
              <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {category}
                </h3>
              </div>

              <!-- Commands -->
              <div class="divide-y divide-gray-100 dark:divide-gray-800">
                {#each cmds as command, cmdIndex}
                  {@const globalIndex = filteredCommands.indexOf(command)}
                  {@const Icon = command.icon}
                  <button
                    onclick={() => executeCommand(command)}
                    onmouseenter={() => selectedIndex = globalIndex}
                    class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all group {selectedIndex === globalIndex ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-l-4 border-indigo-500' : ''}"
                  >
                    <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 group-hover:from-indigo-100 group-hover:to-purple-100 dark:group-hover:from-indigo-900/30 dark:group-hover:to-purple-900/30 transition-all">
                      <Icon class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                    </div>
                    <div class="flex-1 text-left">
                      <div class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {command.title}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {command.description}
                      </div>
                    </div>
                    {#if selectedIndex === globalIndex}
                      <div class="flex items-center gap-1">
                        <kbd class="px-2 py-0.5 text-[10px] font-mono bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                          Enter
                        </kbd>
                      </div>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between px-4 py-3 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-1">
            <CommandIcon class="w-3 h-3" />
            <span>+</span>
            <kbd class="px-1.5 py-0.5 font-mono bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">K</kbd>
            <span class="ml-1">to toggle</span>
          </div>
          <div class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 font-mono bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">в†‘</kbd>
            <kbd class="px-1.5 py-0.5 font-mono bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">в†“</kbd>
            <span class="ml-1">to navigate</span>
          </div>
        </div>
        <div class="text-xs text-gray-400">
          {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }

  .animate-scale-in {
    animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .command-palette {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
</style>

