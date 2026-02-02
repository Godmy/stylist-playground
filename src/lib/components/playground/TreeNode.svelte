<script lang="ts">
  import { ChevronRight, Folder, FolderOpen, FileCode } from 'lucide-svelte';
  import Self from './TreeNode.svelte';

  interface Story {
    id: string;
    componentName: string;
    category: string;
    subcategory?: string;
    path: string;
  }

  interface TreeNodeData {
    name: string;
    type: 'category' | 'folder' | 'component';
    children?: TreeNodeData[];
    story?: Story;
    autoStory?: Story;
    path: string;
    count?: number;
  }

  interface Props {
    node: TreeNodeData;
    level: number;
    expandedNodes: Set<string>;
    categoryConfig: Record<string, {
      icon: any;
      color: string;
      bg: string;
      border: string;
    }>;
    onToggle: (path: string) => void;
    onComponentClick: (story: Story) => void;
    selectedStoryId?: string | null;
    focusedPath?: string | null;
  }

  let {
    node,
    level,
    expandedNodes,
    categoryConfig,
    onToggle,
    onComponentClick,
    selectedStoryId = null,
    focusedPath = null
  }: Props = $props();

  const isExpanded = $derived(expandedNodes.has(node.path));
  const hasChildren = $derived(node.children && node.children.length > 0);
  const isAutoSelectable = $derived(!!node.autoStory);

  // Get category config based on path
  const config = $derived.by(() => {
    const categoryName = node.path.split('/')[0];
    return categoryConfig[categoryName];
  });

  // Calculate padding based on level and type
  // Folders use level * 12px
  // Components add extra space to align with folder content (chevron 14px + gap 8px = 22px)
  const leftPadding = $derived(
    node.type === 'component'
      ? `padding-left: ${level * 12 + 22}px`
      : `padding-left: ${level * 12}px`
  );

  // Determine if this component node is selected
  const isSelected = $derived(
    (node.type === 'component' && node.story?.id && node.story.id === selectedStoryId) ||
      (node.type === 'folder' && node.autoStory?.id && node.autoStory.id === selectedStoryId)
  );

  // Determine if this node is focused (for keyboard navigation)
  const isFocused = $derived(focusedPath === node.path);
</script>

{#if node.type === 'category'}
  <!-- Category Node -->
  <div class="space-y-0.5">
    <button
      onclick={() => onToggle(node.path)}
      class="w-full flex items-center gap-2 pr-2 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group"
      class:focused={isFocused}
      style="padding-left: 0px"
    >
      <!-- Chevron -->
      <div class="flex-shrink-0 w-3.5 transition-transform duration-200 {isExpanded ? 'rotate-90' : ''}">
        <ChevronRight class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
      </div>

      <!-- Icon -->
      {#if config?.icon}
        {@const IconComponent = config.icon}
        <div class="flex-shrink-0 w-3.5">
          <IconComponent class="w-3.5 h-3.5 {config.color}" />
        </div>
      {/if}

      <!-- Name -->
      <span class="flex-1 text-left font-semibold text-xs text-gray-900 dark:text-gray-100 min-w-0">
        {node.name}
      </span>

      <!-- Count -->
      <span class="w-8 text-right text-xs font-bold text-gray-500 dark:text-gray-400 tabular-nums flex-shrink-0">
        {node.count || 0}
      </span>
    </button>

    <!-- Category Children with border -->
    {#if isExpanded && hasChildren}
      <div class="relative mt-1">
        <!-- Vertical border line -->
        <div class="absolute left-[14px] top-0 bottom-0 w-0.5 {config.border} bg-current"></div>

        <!-- Children -->
        <div class="space-y-0.5">
          {#each node.children || [] as child}
            <Self
              node={child}
              level={level + 1}
              {expandedNodes}
              {categoryConfig}
              {onToggle}
              {onComponentClick}
              {selectedStoryId}
              {focusedPath}
            />
          {/each}
        </div>
      </div>
    {/if}
  </div>
{:else if node.type === 'folder'}
  <!-- Folder Node -->
  <div class="space-y-0.5">
    <button
      onclick={() => {
        if (isAutoSelectable && node.autoStory) {
          onComponentClick(node.autoStory);
        } else {
          onToggle(node.path);
        }
      }}
      style={leftPadding}
      class="folder-node w-full flex items-center gap-2 pr-2 py-1.5 rounded-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
      class:auto-selectable={isAutoSelectable}
      class:auto-selected={isAutoSelectable && node.autoStory?.id === selectedStoryId}
      class:focused={isFocused}
      aria-current={isAutoSelectable && node.autoStory?.id === selectedStoryId ? 'true' : undefined}
    >
      <!-- Chevron -->
      {#if !isAutoSelectable}
        <div class="flex-shrink-0 w-3.5 transition-transform duration-200 {isExpanded ? 'rotate-90' : ''}">
          <ChevronRight class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
        </div>
      {:else}
        <div class="flex-shrink-0 w-3.5">
          <span class="inline-flex w-2 h-2 rounded-full bg-[var(--playground-accent,#FF6B35)]"></span>
        </div>
      {/if}

      <!-- Folder Icon -->
      <div class="flex-shrink-0 w-3.5">
        {#if isAutoSelectable}
          <Folder class="w-3.5 h-3.5 text-[var(--playground-accent,#FF6B35)]" />
        {:else}
          {#if isExpanded}
            <FolderOpen class="w-3.5 h-3.5 {config.color} opacity-70" />
          {:else}
            <Folder class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          {/if}
        {/if}
      </div>

      <!-- Name -->
      <span class="flex-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300 min-w-0">
        {node.name}
      </span>

      <!-- Count -->
      <span class="w-8 text-right text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
        {node.count || 0}
      </span>
    </button>

    <!-- Folder Children with border -->
    {#if !isAutoSelectable && isExpanded && hasChildren}
      <div class="relative mt-0.5">
        <!-- Vertical border line -->
        <div class="absolute w-px bg-gray-200 dark:bg-gray-700 top-0 bottom-0" style="left: {level * 12 + 14}px"></div>

        <!-- Children -->
        <div class="space-y-0.5">
          {#each node.children || [] as child}
            <Self
              node={child}
              level={level + 1}
              {expandedNodes}
              {categoryConfig}
              {onToggle}
              {onComponentClick}
              {selectedStoryId}
              {focusedPath}
            />
          {/each}
        </div>
      </div>
    {/if}
  </div>
{:else if node.type === 'component' && node.story}
  <!-- Component Node -->
  <button
    onclick={() => onComponentClick(node.story!)}
    style={leftPadding}
    class="component-node w-full flex items-center gap-2 pr-2 pl-1 py-1.5 text-xs rounded-md border border-transparent transition-all duration-150 group text-gray-600 dark:text-gray-400"
    class:selected={isSelected}
    class:focused={isFocused}
    aria-current={isSelected ? 'true' : undefined}
  >
    <span class="component-indicator" aria-hidden="true"></span>
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <div class="flex-shrink-0 w-3.5">
        <FileCode class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <span class="flex-1 text-left truncate font-medium min-w-0">
        {node.name}
      </span>
    </div>
  </button>
{/if}

<style>
  .component-node {
    position: relative;
  }

  .component-node.selected {
    color: var(--playground-accent, #FF6B35);
    background-color: var(--playground-accent-surface, rgba(255, 107, 53, 0.12));
    border-color: color-mix(in srgb, var(--playground-accent, #FF6B35) 45%, transparent);
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--playground-accent, #FF6B35) 35%, transparent),
      0 12px 25px var(--playground-accent-shadow, rgba(255, 107, 53, 0.2));
  }

  .component-indicator {
    width: 0.35rem;
    height: 1.25rem;
    border-radius: 9999px;
    background-color: transparent;
    transition: background-color 120ms ease;
    flex-shrink: 0;
  }

  .component-node.selected .component-indicator {
    background-color: var(--playground-accent, #FF6B35);
  }

  .folder-node.auto-selectable {
    border: 1px solid transparent;
  }

  .folder-node.auto-selected {
    background-color: var(--playground-accent-surface, rgba(255, 107, 53, 0.12));
    border-color: color-mix(in srgb, var(--playground-accent, #FF6B35) 30%, transparent);
    color: var(--playground-accent, #FF6B35);
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--playground-accent, #FF6B35) 12%, transparent),
      0 10px 20px -6px var(--playground-accent-shadow, rgba(255, 107, 53, 0.18));
  }

  .folder-node.auto-selectable:hover {
    border-color: color-mix(in srgb, var(--playground-accent, #FF6B35) 25%, transparent);
  }

  /* Keyboard navigation focus styles */
  button.focused {
    background-color: rgba(59, 130, 246, 0.1);
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: -2px;
  }

  :global(.dark) button.focused {
    background-color: rgba(59, 130, 246, 0.15);
    outline-color: rgba(59, 130, 246, 0.6);
  }
</style>
