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
  <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Search and Controls Bar -->
    <div class="mb-6 space-y-4">
      <!-- Search -->
      <div class="flex items-center gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search components... (try 'button', 'input', 'card')"
            class="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900/50 transition-all shadow-sm"
          />
          {#if searchQuery}
            <button
              onclick={() => searchQuery = ''}
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
            >
              <X class="w-4 h-4" />
            </button>
          {/if}
        </div>

        <!-- View toggle -->
        <div class="flex items-center gap-1 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-orange-200 dark:border-gray-700 p-1.5 shadow-sm">
          <button
            onclick={() => viewMode = 'grid'}
            class="px-3 py-2 rounded-md transition-all duration-200 {viewMode === 'grid' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' : 'text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white/50 dark:hover:bg-gray-700/50'}"
            title="Grid view"
          >
            <Grid class="w-5 h-5" />
          </button>
          <button
            onclick={() => viewMode = 'list'}
            class="px-3 py-2 rounded-md transition-all duration-200 {viewMode === 'list' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' : 'text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white/50 dark:hover:bg-gray-700/50'}"
            title="List view"
          >
            <List class="w-5 h-5" />
          </button>
        </div>

        <!-- Sort -->
        <div class="relative">
          <select
            bind:value={sortBy}
            class="appearance-none pl-4 pr-12 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-colors cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 min-w-[180px] shadow-sm"
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
          class="px-4 py-3 rounded-lg border-2 transition-all shadow-sm {showFilters ? 'border-orange-500 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-orange-400 dark:hover:border-orange-500'}"
          title={showFilters ? 'Hide filters' : 'Show filters'}
        >
          <Filter class="w-5 h-5" />
        </button>
      </div>

      <!-- Filters -->
      {#if showFilters}
        <div class="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-orange-200 dark:border-gray-700 space-y-6 shadow-md">
          <!-- Categories -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
            <div class="flex flex-wrap gap-3">
              {#each categories as category}
                {@const colors = getCategoryColor(category)}
                {@const isSelected = selectedCategories.has(category)}
                <button
                  onclick={() => toggleCategory(category)}
                  class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 hover:scale-105 shadow-sm {isSelected ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-500 shadow-lg ring-4 ring-orange-200 dark:ring-orange-900/50' : colors.bg + ' ' + colors.text + ' ' + colors.border + ' hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-md'}"
                >
                  {category}
                  <span class="ml-2 {isSelected ? 'opacity-90' : 'opacity-70'} text-xs">
                    ({groupedStories[category] ? Object.values(groupedStories[category]).flat().length : 0})
                  </span>
                </button>
              {/each}
            </div>
          </div>

          <!-- Tags -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
            <div class="flex flex-wrap gap-2">
              {#each allTags.slice(0, 20) as tag}
                {@const isSelected = selectedTags.has(tag)}
                <button
                  onclick={() => toggleTag(tag)}
                  class="px-3 py-2 rounded-lg text-sm font-bold transition-all border-2 flex items-center gap-1.5 shadow-sm {isSelected ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500 shadow-lg ring-4 ring-purple-200 dark:ring-purple-900/50' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:scale-105 hover:shadow-md'}"
                >
                  <Tag class="w-3.5 h-3.5" />
                  {tag}
                </button>
              {/each}
            </div>
          </div>

          <!-- Clear filters -->
          {#if selectedCategories.size > 0 || selectedTags.size > 0 || searchQuery}
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onclick={clearFilters}
                class="px-5 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-sm rounded-xl border-2 border-red-400 hover:shadow-xl hover:shadow-red-500/50 hover:scale-105 transition-all flex items-center gap-2 shadow-md"
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
    <div class="mb-6 px-4 py-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border-l-4 border-orange-500 text-sm text-gray-700 dark:text-gray-300 shadow-sm">
      Showing <span class="font-bold text-orange-600 dark:text-orange-400">{stats.filtered}</span> of <span class="font-bold text-orange-600 dark:text-orange-400">{stats.total}</span> components
    </div>

    <!-- Components Grid/List -->
    {#if viewMode === 'grid'}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each filteredStories as story}
          {@const colors = getCategoryColor(story.category)}
          {@const IconComponent = getCategoryIcon(story.category)}
          <button
            onclick={() => openPlayground(story.id)}
            class="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all text-left hover:scale-105 hover:-translate-y-2"
          >
            <!-- Preview placeholder -->
            <div class="w-full h-32 mb-6 rounded-xl bg-gradient-to-br {colors.bg} border-2 {colors.border} flex items-center justify-center overflow-hidden relative group-hover:scale-105 transition-transform">
              <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <IconComponent class="w-16 h-16 {colors.text} opacity-30 group-hover:opacity-50 transition-opacity" />
              <div class="absolute bottom-2 right-2 px-2 py-1 bg-white/90 dark:bg-gray-900/90 rounded text-xs font-semibold {colors.text}">
                Preview
              </div>
            </div>

            <!-- Header with icon and category -->
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-lg {colors.bg} border-2 {colors.border} flex items-center justify-center shadow-sm">
                <IconComponent class="w-5 h-5 {colors.text}" />
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white capitalize shadow-sm">
                {story.category}
              </span>
            </div>

            <!-- Component name -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2">
              {story.componentName}
            </h3>

            <!-- Description -->
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {getComponentDescription(story)}
            </p>

            <!-- Metadata -->
            <div class="flex flex-wrap items-center gap-2 mb-4">
              {#if story.subcategory}
                <div class="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300">
                  <Tag class="w-3 h-3" />
                  <span class="capitalize">{story.subcategory}</span>
                </div>
              {/if}
              <div class="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-md text-xs text-green-700 dark:text-green-400 font-semibold">
                <Sparkles class="w-3 h-3" />
                AI-Generated
              </div>
            </div>

            <!-- Action -->
            <div class="flex items-center justify-between pt-3 border-t-2 border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-400">Svelte 5</span>
              <div class="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open</span>
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="space-y-4">
        {#each filteredStories as story}
          {@const colors = getCategoryColor(story.category)}
          {@const IconComponent = getCategoryIcon(story.category)}
          <button
            onclick={() => openPlayground(story.id)}
            class="group w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all flex items-center gap-6 hover:scale-[1.02] hover:-translate-y-1"
          >
            <!-- Icon -->
            <div class="w-20 h-20 rounded-xl bg-gradient-to-br {colors.bg} border-2 {colors.border} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
              <IconComponent class="w-10 h-10 {colors.text}" />
            </div>

            <!-- Info -->
            <div class="flex-1 text-left">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2">
                {story.componentName}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {getComponentDescription(story)}
              </p>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs px-3 py-1.5 rounded-full font-bold bg-orange-500 text-white capitalize shadow-sm">
                  {story.category}
                </span>
                {#if story.subcategory}
                  <div class="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300">
                    <Tag class="w-3 h-3" />
                    <span class="capitalize">{story.subcategory}</span>
                  </div>
                {/if}
                <div class="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-md text-xs text-green-700 dark:text-green-400 font-semibold">
                  <Sparkles class="w-3 h-3" />
                  AI-Generated
                </div>
                <span class="text-xs text-gray-400 ml-auto">Svelte 5</span>
              </div>
            </div>

            <!-- Arrow -->
            <div class="text-gray-300 dark:text-gray-600 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:translate-x-3 transition-all flex-shrink-0">
              <ArrowRight class="w-8 h-8" />
            </div>
          </button>
        {/each}
      </div>
    {/if}

    <!-- Empty state -->
    {#if filteredStories.length === 0}
      <div class="text-center py-24 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border-2 border-dashed border-orange-300 dark:border-gray-700 shadow-inner">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:bg-gray-700 mb-8 shadow-lg">
          <Search class="w-12 h-12 text-orange-500 dark:text-orange-400" />
        </div>
        <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-3">No components found</h3>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">Try adjusting your search or filters</p>
        <button
          onclick={clearFilters}
          class="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all shadow-lg"
        >
          Clear all filters
        </button>
      </div>
    {/if}
  </div>
</div>
