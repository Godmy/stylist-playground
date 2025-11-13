<script lang="ts">
  import { goto } from '$app/navigation';

  // Get paths to all story files (don't load them to avoid import errors)
  const storyImports = import.meta.glob(
    '../../../../stylist-svelte/src/lib/components/**/*.story.svelte'
  );

  // Extract story information from file paths
  const stories = Object.keys(storyImports).map(path => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1].replace('.story.svelte', '');
    const category = parts.find(p => ['atoms', 'molecules', 'organisms'].includes(p)) || 'atoms';
    const folderIndex = parts.findIndex(p => ['atoms', 'molecules', 'organisms'].includes(p)) + 1;
    const subcategory = folderIndex < parts.length - 1 ? parts[folderIndex] : undefined;

    return {
      id: `${category}-${subcategory || 'general'}-${fileName}`.toLowerCase(),
      name: fileName,
      category,
      subcategory,
      path
    };
  });

  // Group by category
  const categorizedStories = $derived.by(() => {
    const grouped = new Map<string, typeof stories>();
    const cats = ['atoms', 'molecules', 'organisms'];

    cats.forEach(cat => {
      const filtered = stories.filter(s => s.category === cat);
      if (filtered.length > 0) {
        grouped.set(cat.charAt(0).toUpperCase() + cat.slice(1), filtered);
      }
    });

    return grouped;
  });

  let selectedCategory = $state<string | null>(null);
  let selectedStory = $state<typeof stories[0] | null>(null);

  function selectStory(story: typeof stories[0]) {
    selectedStory = story;
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Component Stories
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        Browse {stories.length} interactive component stories
      </p>
    </div>

    <!-- Categories -->
    {#each [...categorizedStories()] as [category, categoryStories]}
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {category} ({categoryStories.length})
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each categoryStories as story}
            <button
              onclick={() => goto(`/playground/${story.id}`)}
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all text-left w-full"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {story.name}
              </h3>
              {#if story.subcategory}
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {story.subcategory}
                </p>
              {/if}
              <p class="text-xs text-gray-400 dark:text-gray-500 font-mono truncate">
                {story.path.split('/').slice(-3).join('/')}
              </p>
            </button>
          {/each}
        </div>
      </div>
    {/each}

    {#if stories.length === 0}
      <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400">No component stories found</p>
      </div>
    {/if}
  </div>
</div>
