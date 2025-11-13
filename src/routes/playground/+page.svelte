<script lang="ts">
  import { goto } from '$app/navigation';
  import { allStories, groupedStories } from '../../lib/utils/stories';
  import {
    Layers,
    Package,
    Grid,
    List,
    Search,
    Filter,
    ArrowRight,
    X,
    Tag,
    Sparkles,
    Code,
    Palette
  } from 'lucide-svelte';

  // View modes
  type ViewMode = 'grid' | 'list';
  type SortBy = 'name' | 'category';

  let searchQuery = $state('');
  let selectedCategories = $state<Set<string>>(new Set());
  let viewMode = $state<ViewMode>('grid');
  let sortBy = $state<SortBy>('name');
  let showFilters = $state(false);

  // Categories
  const categories = $derived(Object.keys(groupedStories));

  // Advanced filtering
  const filteredStories = $derived.by(() => {
    let stories = [...allStories];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      stories = stories.filter(
        story =>
          story.componentName.toLowerCase().includes(query) ||
          story.category.toLowerCase().includes(query) ||
          story.subcategory?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.size > 0) {
      stories = stories.filter(story =>
        selectedCategories.has(story.category)
      );
    }

    // Sorting
    stories.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.componentName.localeCompare(b.componentName);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return stories;
  });

  // Stats
  const stats = $derived.by(() => ({
    total: allStories.length,
    filtered: filteredStories.length,
    atoms: allStories.filter(s => s.category === 'atoms').length,
    molecules: allStories.filter(s => s.category === 'molecules').length,
    organisms: allStories.filter(s => s.category === 'organisms').length
  }));

  // Category colors
  const categoryColors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    atoms: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    molecules: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
    },
    organisms: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      hover: 'hover:bg-green-100 dark:hover:bg-green-900/30'
    }
  };

  function getCategoryColor(category: string) {
    return categoryColors[category.toLowerCase()] || categoryColors.atoms;
  }

  function toggleCategory(category: string) {
    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
    } else {
      selectedCategories.add(category);
    }
    selectedCategories = new Set(selectedCategories);
  }

  function clearFilters() {
    selectedCategories.clear();
    searchQuery = '';
    selectedCategories = new Set();
  }

  function openPlayground(storyId: string) {
    goto(`/playground/${storyId}`);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Header -->
    <div class="text-center mb-12">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 mb-6">
        <Sparkles class="w-10 h-10 text-white" />
      </div>

      <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
        Interactive Playground
      </h1>

      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
        Explore, customize, and experiment with {stats().total} production-ready Svelte 5 components in real-time
      </p>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-center mb-2">
            <Package class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats().total}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Total Components</div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-center mb-2">
            <Code class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats().atoms}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Atoms</div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-center mb-2">
            <Layers class="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats().molecules}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Molecules</div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-green-200 dark:border-green-800 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-center mb-2">
            <Palette class="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{stats().organisms}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Organisms</div>
        </div>
      </div>
    </div>

    <!-- Search and Controls -->
    <div class="mb-8 space-y-4">
      <!-- Search Bar -->
      <div class="flex items-center gap-4">
        <div class="flex-1 relative group">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search components... (try 'button', 'input', 'card')"
            class="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm hover:shadow-md"
          />
          {#if searchQuery}
            <button
              onclick={() => searchQuery = ''}
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <X class="w-4 h-4" />
            </button>
          {/if}
        </div>

        <!-- View Toggle -->
        <div class="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-1.5 shadow-sm">
          <button
            onclick={() => viewMode = 'grid'}
            class="p-2.5 rounded-lg transition-all {viewMode === 'grid' ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}"
            title="Grid view"
            aria-label="Grid view"
          >
            <Grid class="w-5 h-5" />
          </button>
          <button
            onclick={() => viewMode = 'list'}
            class="p-2.5 rounded-lg transition-all {viewMode === 'list' ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}"
            title="List view"
            aria-label="List view"
          >
            <List class="w-5 h-5" />
          </button>
        </div>

        <!-- Sort -->
        <select
          bind:value={sortBy}
          class="px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm hover:shadow-md"
        >
          <option value="name">Sort by Name</option>
          <option value="category">Sort by Category</option>
        </select>

        <!-- Filter Toggle -->
        <button
          onclick={() => showFilters = !showFilters}
          class="px-4 py-4 rounded-xl border-2 transition-all shadow-sm hover:shadow-md {showFilters ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}"
          aria-label="Toggle filters"
        >
          <Filter class="w-5 h-5" />
        </button>
      </div>

      <!-- Filters Panel -->
      {#if showFilters}
        <div class="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg animate-slide-down">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Tag class="w-4 h-4" />
            Filter by Category
          </h3>
          <div class="flex flex-wrap gap-2">
            {#each categories as category}
              {@const colors = getCategoryColor(category)}
              <button
                onclick={() => toggleCategory(category)}
                class="px-4 py-2 rounded-lg text-sm font-semibold transition-all {colors.bg} {colors.text} {colors.hover} {selectedCategories.has(category) ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'hover:scale-105'}"
              >
                {category}
                <span class="ml-1.5 opacity-70 font-normal">
                  ({groupedStories[category] ? Object.values(groupedStories[category]).flat().length : 0})
                </span>
              </button>
            {/each}
          </div>

          {#if selectedCategories.size > 0 || searchQuery}
            <button
              onclick={clearFilters}
              class="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <X class="w-3 h-3" />
              Clear all filters
            </button>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Results Count -->
    <div class="mb-6 flex items-center justify-between">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing <span class="font-bold text-gray-900 dark:text-white">{stats().filtered}</span> of <span class="font-bold text-gray-900 dark:text-white">{stats().total}</span> components
      </p>

      {#if selectedCategories.size > 0}
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
          {#each Array.from(selectedCategories) as category}
            {@const colors = getCategoryColor(category)}
            <span class="px-2 py-1 rounded text-xs font-medium {colors.bg} {colors.text}">
              {category}
            </span>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Components Grid/List -->
    {#if viewMode === 'grid'}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each filteredStories as story}
          {@const colors = getCategoryColor(story.category)}
          <button
            onclick={() => openPlayground(story.id)}
            class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 text-left hover:scale-105 active:scale-100"
          >
            <!-- Preview Area with gradient -->
            <div class="h-36 mb-4 rounded-xl {colors.bg} border-2 {colors.border} flex items-center justify-center overflow-hidden relative group-hover:shadow-lg transition-shadow">
              <div class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-black/20 dark:to-transparent"></div>
              <div class="relative text-5xl font-bold {colors.text} opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300">
                {story.componentName.charAt(0)}
              </div>
            </div>

            <!-- Component Info -->
            <div class="space-y-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {story.componentName}
              </h3>

              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2.5 py-1 rounded-lg text-xs font-semibold {colors.bg} {colors.text} capitalize border {colors.border}">
                  {story.category}
                </span>
                {#if story.subcategory}
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {story.subcategory}
                  </span>
                {/if}
              </div>
            </div>

            <!-- Hover Arrow -->
            <div class="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open playground</span>
              <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="space-y-3">
        {#each filteredStories as story}
          {@const colors = getCategoryColor(story.category)}
          <button
            onclick={() => openPlayground(story.id)}
            class="group w-full bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 flex items-center gap-5 hover:scale-[1.02] active:scale-100"
          >
            <!-- Icon -->
            <div class="w-20 h-20 rounded-xl {colors.bg} border-2 {colors.border} flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-black/20 dark:to-transparent"></div>
              <div class="relative text-3xl font-bold {colors.text} group-hover:scale-110 transition-transform">
                {story.componentName.charAt(0)}
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 text-left">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                {story.componentName}
              </h3>
              <div class="flex items-center gap-3">
                <span class="text-sm px-3 py-1 rounded-lg font-semibold {colors.bg} {colors.text} capitalize border {colors.border}">
                  {story.category}
                </span>
                {#if story.subcategory}
                  <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    / {story.subcategory}
                  </span>
                {/if}
              </div>
            </div>

            <!-- Arrow -->
            <div class="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-2 transition-all">
              <ArrowRight class="w-6 h-6" />
            </div>
          </button>
        {/each}
      </div>
    {/if}

    <!-- Empty State -->
    {#if filteredStories.length === 0}
      <div class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
          <Search class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No components found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
        <button
          onclick={clearFilters}
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          Clear all filters
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slide-down {
    animation: slide-down 0.2s ease-out;
  }

  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
</style>
