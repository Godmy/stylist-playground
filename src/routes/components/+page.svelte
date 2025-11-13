<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { allStories, groupedStories } from '../../lib/utils/stories';
  import { Search, Filter, Grid, List, SortAsc, X, Tag } from 'lucide-svelte';

  // View modes
  type ViewMode = 'grid' | 'list';
  type SortBy = 'name' | 'category' | 'recent';

  let searchQuery = $state('');
  let selectedCategories = $state<Set<string>>(new Set());
  let selectedTags = $state<Set<string>>(new Set());
  let viewMode = $state<ViewMode>('grid');
  let sortBy = $state<SortBy>('name');
  let showFilters = $state(true);

  // Extract all unique tags from stories (example tags, you can add to story metadata)
  const allTags = $derived.by(() => {
    const tags = new Set<string>();
    allStories.forEach(story => {
      if (story.category) tags.add(story.category);
      if (story.subcategory) tags.add(story.subcategory);
    });
    return Array.from(tags).sort();
  });

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

    // Tag filter
    if (selectedTags.size > 0) {
      stories = stories.filter(story =>
        selectedTags.has(story.category) ||
        (story.subcategory && selectedTags.has(story.subcategory))
      );
    }

    // Sorting
    stories.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.componentName.localeCompare(b.componentName);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'recent':
          return 0; // Would need timestamp metadata
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
  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    atoms: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    molecules: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    organisms: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' }
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

  function toggleTag(tag: string) {
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
    } else {
      selectedTags.add(tag);
    }
    selectedTags = new Set(selectedTags);
  }

  function clearFilters() {
    selectedCategories.clear();
    selectedTags.clear();
    searchQuery = '';
    selectedCategories = new Set();
    selectedTags = new Set();
  }

  function openPlayground(storyId: string) {
    goto(`/playground/${storyId}`);
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Component Library
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Explore {stats().total} production-ready Svelte 5 components
      </p>
    </div>

    <!-- Search and Controls Bar -->
    <div class="mb-6 space-y-4">
      <!-- Search -->
      <div class="flex items-center gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search components... (try 'button', 'input', 'card')"
            class="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
          />
          {#if searchQuery}
            <button
              onclick={() => searchQuery = ''}
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X class="w-4 h-4" />
            </button>
          {/if}
        </div>

        <!-- View toggle -->
        <div class="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-1">
          <button
            onclick={() => viewMode = 'grid'}
            class="p-2 rounded transition-colors"
            class:bg-indigo-100={viewMode === 'grid'}
            class:dark:bg-indigo-900={viewMode === 'grid'}
            class:text-indigo-600={viewMode === 'grid'}
            class:dark:text-indigo-400={viewMode === 'grid'}
            title="Grid view"
          >
            <Grid class="w-5 h-5" />
          </button>
          <button
            onclick={() => viewMode = 'list'}
            class="p-2 rounded transition-colors"
            class:bg-indigo-100={viewMode === 'list'}
            class:dark:bg-indigo-900={viewMode === 'list'}
            class:text-indigo-600={viewMode === 'list'}
            class:dark:text-indigo-400={viewMode === 'list'}
            title="List view"
          >
            <List class="w-5 h-5" />
          </button>
        </div>

        <!-- Sort -->
        <select
          bind:value={sortBy}
          class="px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="name">Sort by Name</option>
          <option value="category">Sort by Category</option>
          <option value="recent">Recently Updated</option>
        </select>

        <!-- Filter toggle -->
        <button
          onclick={() => showFilters = !showFilters}
          class="px-4 py-3 rounded-lg border-2 transition-colors {showFilters ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}"
        >
          <Filter class="w-5 h-5" />
        </button>
      </div>

      <!-- Filters -->
      {#if showFilters}
        <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 space-y-4">
          <!-- Categories -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Categories</h3>
            <div class="flex flex-wrap gap-2">
              {#each categories as category}
                {@const colors = getCategoryColor(category)}
                <button
                  onclick={() => toggleCategory(category)}
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-all {colors.bg} {colors.text} {selectedCategories.has(category) ? 'ring-2 ring-indigo-500' : ''}"
                >
                  {category}
                  <span class="ml-1 opacity-60">
                    ({groupedStories[category] ? Object.values(groupedStories[category]).flat().length : 0})
                  </span>
                </button>
              {/each}
            </div>
          </div>

          <!-- Tags -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              {#each allTags().slice(0, 20) as tag}
                <button
                  onclick={() => toggleTag(tag)}
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  class:bg-indigo-100={selectedTags.has(tag)}
                  class:dark:bg-indigo-900={selectedTags.has(tag)}
                  class:text-indigo-600={selectedTags.has(tag)}
                  class:dark:text-indigo-400={selectedTags.has(tag)}
                  class:bg-gray-100={!selectedTags.has(tag)}
                  class:dark:bg-gray-700={!selectedTags.has(tag)}
                  class:text-gray-700={!selectedTags.has(tag)}
                  class:dark:text-gray-300={!selectedTags.has(tag)}
                >
                  <Tag class="w-3 h-3 inline mr-1" />
                  {tag}
                </button>
              {/each}
            </div>
          </div>

          <!-- Clear filters -->
          {#if selectedCategories.size > 0 || selectedTags.size > 0 || searchQuery}
            <button
              onclick={clearFilters}
              class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear all filters
            </button>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Showing <span class="font-semibold">{stats().filtered}</span> of <span class="font-semibold">{stats().total}</span> components
    </div>

    <!-- Components Grid/List -->
    {#if viewMode === 'grid'}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each filteredStories as story}
          {@const colors = getCategoryColor(story.category)}
          <button
            onclick={() => openPlayground(story.id)}
            class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all text-left"
          >
            <!-- Preview area -->
            <div class="h-32 mb-4 rounded-lg {colors.bg} border-2 {colors.border} flex items-center justify-center overflow-hidden">
              <div class="text-4xl opacity-50 group-hover:scale-110 transition-transform">
                {story.componentName.charAt(0)}
              </div>
            </div>

            <!-- Info -->
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
              {story.componentName}
            </h3>
            <div class="flex items-center gap-2 text-xs">
              <span class="px-2 py-0.5 rounded-full {colors.bg} {colors.text} capitalize">
                {story.category}
              </span>
              {#if story.subcategory}
                <span class="text-gray-500 dark:text-gray-400">
                  {story.subcategory}
                </span>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="space-y-2">
        {#each filteredStories as story}
          {@const colors = getCategoryColor(story.category)}
          <button
            onclick={() => openPlayground(story.id)}
            class="group w-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all flex items-center gap-4"
          >
            <!-- Icon -->
            <div class="w-16 h-16 rounded-lg {colors.bg} border {colors.border} flex items-center justify-center flex-shrink-0">
              <div class="text-2xl font-bold {colors.text}">
                {story.componentName.charAt(0)}
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 text-left">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {story.componentName}
              </h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-sm px-2 py-0.5 rounded {colors.bg} {colors.text} capitalize">
                  {story.category}
                </span>
                {#if story.subcategory}
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    / {story.subcategory}
                  </span>
                {/if}
              </div>
            </div>

            <!-- Arrow -->
            <div class="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">
              →
            </div>
          </button>
        {/each}
      </div>
    {/if}

    <!-- Empty state -->
    {#if filteredStories.length === 0}
      <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400 mb-2">No components found</p>
        <button
          onclick={clearFilters}
          class="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Clear filters
        </button>
      </div>
    {/if}
  </div>
</div>
