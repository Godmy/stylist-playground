<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { allStories, groupedStories } from '../../lib/utils/stories';
  import { Search, Filter, Grid, List, SortAsc, X, Tag, Code, Layers, Package, ArrowRight, Sparkles, ExternalLink, FileCode, FolderOpen } from 'lucide-svelte';

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
    atoms: allStories.filter(s => s.category.toLowerCase() === 'atoms').length,
    molecules: allStories.filter(s => s.category.toLowerCase() === 'molecules').length,
    organisms: allStories.filter(s => s.category.toLowerCase() === 'organisms').length
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

  function getCategoryIcon(category: string) {
    const cat = category.toLowerCase();
    if (cat === 'atoms') return Code;
    if (cat === 'molecules') return Layers;
    if (cat === 'organisms') return Package;
    return Sparkles;
  }

  function getComponentDescription(story: any) {
    const category = story.category.toLowerCase();
    const subcategory = story.subcategory || '';

    // Generate description based on component type
    if (subcategory.includes('button')) return 'Interactive button component with variants';
    if (subcategory.includes('input')) return 'Form input with validation';
    if (subcategory.includes('card')) return 'Flexible card container';
    if (subcategory.includes('modal')) return 'Modal dialog overlay';
    if (subcategory.includes('toggle')) return 'Toggle switch control';
    if (subcategory.includes('select')) return 'Dropdown selection';
    if (subcategory.includes('slider')) return 'Range slider control';

    if (category === 'atoms') return 'Basic UI building block';
    if (category === 'molecules') return 'Composite UI component';
    if (category === 'organisms') return 'Complex UI section';

    return 'Svelte 5 component';
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

  function getShortPath(path: string): string {
    // Extract meaningful path like "atoms/controls/buttons"
    const parts = path.split('/');
    const componentsIndex = parts.findIndex(p => p === 'components');
    if (componentsIndex !== -1) {
      const relevantParts = parts.slice(componentsIndex + 1, -1); // exclude "components" and filename
      return relevantParts.join('/');
    }
    return path;
  }

  function openSourceFile(path: string, event: Event) {
    event.stopPropagation();
    // In a real app, this would open the file in the editor or GitHub
    console.log('Open source file:', path);
    alert(`Source file path:\n${path}\n\n(In production, this would open in your editor or GitHub)`);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full mb-4 border-2 border-indigo-200 dark:border-indigo-800">
        <Package class="w-5 h-5" />
        <span class="text-sm font-bold">Component Library</span>
      </div>
      <h1 class="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
        Browse Components
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Explore <span class="font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</span> production-ready Svelte 5 components built with AI
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
        <div class="flex items-center gap-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-1.5 shadow-inner">
          <button
            onclick={() => viewMode = 'grid'}
            class="px-3 py-2 rounded-md transition-all duration-200 {viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300 dark:ring-indigo-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'}"
            title="Grid view"
          >
            <Grid class="w-5 h-5" />
          </button>
          <button
            onclick={() => viewMode = 'list'}
            class="px-3 py-2 rounded-md transition-all duration-200 {viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300 dark:ring-indigo-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'}"
            title="List view"
          >
            <List class="w-5 h-5" />
          </button>
        </div>

        <!-- Sort -->
        <div class="relative">
          <select
            bind:value={sortBy}
            class="appearance-none pl-4 pr-12 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer hover:border-indigo-400 min-w-[180px]"
            style="color-scheme: light dark;"
          >
            <option value="name" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Sort by Name</option>
            <option value="category" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Sort by Category</option>
            <option value="recent" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Recently Updated</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <SortAsc class="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <!-- Filter toggle -->
        <button
          onclick={() => showFilters = !showFilters}
          class="px-4 py-3 rounded-lg border-2 transition-all {showFilters ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300 dark:ring-indigo-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500'}"
          title={showFilters ? 'Hide filters' : 'Show filters'}
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
                {@const isSelected = selectedCategories.has(category)}
                <button
                  onclick={() => toggleCategory(category)}
                  class="px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 hover:scale-105 {isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg ring-2 ring-indigo-300 dark:ring-indigo-500' : colors.bg + ' ' + colors.text + ' ' + colors.border + ' hover:border-indigo-400 dark:hover:border-indigo-500'}"
                >
                  {category}
                  <span class="ml-1.5 opacity-70 text-xs">
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
              {#each allTags.slice(0, 20) as tag}
                {@const isSelected = selectedTags.has(tag)}
                <button
                  onclick={() => toggleTag(tag)}
                  class="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border-2 flex items-center gap-1.5 {isSelected ? 'bg-purple-600 text-white border-purple-600 shadow-lg ring-2 ring-purple-300 dark:ring-purple-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:scale-105'}"
                >
                  <Tag class="w-3 h-3" />
                  {tag}
                </button>
              {/each}
            </div>
          </div>

          <!-- Clear filters -->
          {#if selectedCategories.size > 0 || selectedTags.size > 0 || searchQuery}
            <div class="pt-2">
              <button
                onclick={clearFilters}
                class="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold text-sm rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50 hover:scale-105 transition-all flex items-center gap-2"
              >
                <X class="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Showing <span class="font-semibold">{stats.filtered}</span> of <span class="font-semibold">{stats.total}</span> components
    </div>

    <!-- Components Grid/List -->
    {#if viewMode === 'grid'}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredStories as story}
          {@const colors = getCategoryColor(story.category)}
          {@const IconComponent = getCategoryIcon(story.category)}
          <button
            onclick={() => openPlayground(story.id)}
            class="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all text-left hover:scale-105 hover:-translate-y-1"
          >
            <!-- Header with icon and category -->
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl {colors.bg} border-2 {colors.border} flex items-center justify-center">
                <IconComponent class="w-6 h-6 {colors.text}" />
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold {colors.bg} {colors.text} capitalize border {colors.border}">
                {story.category}
              </span>
            </div>

            <!-- Component name -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
              {story.componentName}
            </h3>

            <!-- Description -->
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[40px]">
              {getComponentDescription(story)}
            </p>

            <!-- Subcategory and action -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              {#if story.subcategory}
                <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Tag class="w-3 h-3" />
                  <span class="capitalize">{story.subcategory}</span>
                </div>
              {:else}
                <div></div>
              {/if}
              <div class="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open</span>
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="space-y-3">
        {#each filteredStories as story}
          {@const colors = getCategoryColor(story.category)}
          {@const IconComponent = getCategoryIcon(story.category)}
          <button
            onclick={() => openPlayground(story.id)}
            class="group w-full bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all flex items-center gap-5 hover:scale-[1.02]"
          >
            <!-- Icon -->
            <div class="w-16 h-16 rounded-xl {colors.bg} border-2 {colors.border} flex items-center justify-center flex-shrink-0">
              <IconComponent class="w-8 h-8 {colors.text}" />
            </div>

            <!-- Info -->
            <div class="flex-1 text-left">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                {story.componentName}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {getComponentDescription(story)}
              </p>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2.5 py-1 rounded-full font-bold {colors.bg} {colors.text} capitalize border {colors.border}">
                  {story.category}
                </span>
                {#if story.subcategory}
                  <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Tag class="w-3 h-3" />
                    <span class="capitalize">{story.subcategory}</span>
                  </div>
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

    <!-- Empty state -->
    {#if filteredStories.length === 0}
      <div class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
          <Search class="w-10 h-10 text-gray-400" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No components found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
        <button
          onclick={clearFilters}
          class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg"
        >
          Clear all filters
        </button>
      </div>
    {/if}
  </div>
</div>
