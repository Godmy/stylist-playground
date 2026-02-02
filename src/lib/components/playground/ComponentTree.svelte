<script lang="ts">
  import { Code, Layers, Package, ChevronRight, Folder, FolderOpen, FileCode } from 'lucide-svelte';
  import TreeNode from './TreeNode.svelte';

  interface Story {
    id: string;
    componentName: string;
    category: string;
    subcategory?: string;
    path: string;
  }

  interface GroupedStories {
    [category: string]: {
      [subcategory: string]: Story[];
    };
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
    onComponentSelect?: (storyId: string) => void;
    groupedStories?: GroupedStories;
    selectedStoryId?: string | null;
  }

  let { onComponentSelect, groupedStories = {}, selectedStoryId = null }: Props = $props();

  // State for expanded nodes - Level 0 (categories) and Level 1 (first-level folders) open by default
  let expandedNodes = $state<Set<string>>(new Set());
  const storyPathMap = new Map<string, string[]>();

  // Keyboard navigation state
  let focusedPath = $state<string | null>(null);
  let treeContainer: HTMLDivElement;

  // Category configuration
  const categoryConfig: Record<string, {
    icon: any;
    color: string;
    bg: string;
    border: string;
  }> = {
    'Atoms': {
      icon: Code,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/10',
      border: 'border-blue-200 dark:border-blue-700'
    },
    'Molecules': {
      icon: Layers,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/10',
      border: 'border-purple-200 dark:border-purple-700'
    },
    'Organisms': {
      icon: Package,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/10',
      border: 'border-green-200 dark:border-green-700'
    }
  };

  // Build tree structure from flat stories
  function buildTree(): TreeNodeData[] {
    storyPathMap.clear();
    const tree: TreeNodeData[] = [];

    Object.keys(categoryConfig).forEach(category => {
      const categoryNode: TreeNodeData = {
        name: category,
        type: 'category',
        path: category,
        children: [],
        count: 0
      };

      const categoryStories = groupedStories[category];
      if (!categoryStories) {
        tree.push(categoryNode);
        return;
      }

      // Build folder hierarchy
      const folderMap = new Map<string, TreeNodeData>();

      Object.entries(categoryStories).forEach(([subcategory, stories]) => {
        stories.forEach(story => {
          // Extract folder path from file path
          // e.g., "atoms/typography/inline/Kbd.story.svelte" -> ["typography", "inline"]
          const pathParts = story.path.split('/');
          const componentsIndex = pathParts.findIndex(p => p === 'components');

          if (componentsIndex === -1) return;

          // Get path segments between 'components' and the file
          const segments = pathParts.slice(componentsIndex + 2, -1); // Skip category and filename

          // Build nested folder structure
          let currentPath = category;
          let currentChildren = categoryNode.children!;
          const segmentsToExpand = [categoryNode.path];

          segments.forEach((segment, index) => {
            const segmentPath = `${currentPath}/${segment}`;

            if (!folderMap.has(segmentPath)) {
              const folderNode: TreeNodeData = {
                name: segment.charAt(0).toUpperCase() + segment.slice(1),
                type: 'folder',
                path: segmentPath,
                children: [],
                count: 0
              };
              folderMap.set(segmentPath, folderNode);
              currentChildren.push(folderNode);
            }

            const folderNode = folderMap.get(segmentPath)!;
            folderNode.count = (folderNode.count || 0) + 1;
            currentChildren = folderNode.children!;
            currentPath = segmentPath;
            segmentsToExpand.push(segmentPath);
          });

          // Add component as leaf node
          currentChildren.push({
            name: story.componentName,
            type: 'component',
            path: `${currentPath}/${story.componentName}`,
            story
          });
          storyPathMap.set(story.id, segmentsToExpand);

          categoryNode.count = (categoryNode.count || 0) + 1;
        });
      });

      // Sort children recursively
      sortTreeNode(categoryNode);
      annotateAutoSelectable(categoryNode);
      tree.push(categoryNode);
    });

    return tree;
  }

  function sortTreeNode(node: TreeNodeData) {
    if (!node.children) return;

    node.children.sort((a, b) => {
      // Folders first, then components
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    node.children.forEach(sortTreeNode);
  }

  const tree = $derived(buildTree());

  // Auto-expand Level 0 (categories) and Level 1 (first-level folders) on mount
  $effect(() => {
    if (tree.length > 0 && expandedNodes.size === 0) {
      const toExpand = new Set<string>();

      // Expand all categories (Level 0)
      tree.forEach(categoryNode => {
        toExpand.add(categoryNode.path);

        // Expand all first-level folders (Level 1)
        if (categoryNode.children) {
          categoryNode.children.forEach(folderNode => {
            if (folderNode.type === 'folder') {
              toExpand.add(folderNode.path);
            }
          });
        }
      });

      expandedNodes = toExpand;
    }
  });

  function toggleNode(path: string) {
    if (expandedNodes.has(path)) {
      expandedNodes.delete(path);
    } else {
      expandedNodes.add(path);
    }
    expandedNodes = new Set(expandedNodes);
    focusedPath = path; // Update focus when toggling
  }

  function annotateAutoSelectable(node: TreeNodeData) {
    if (!node.children || node.children.length === 0) return;

    node.children.forEach(annotateAutoSelectable);

    if (node.type === 'folder' && node.children.length === 1 && node.children[0].type === 'component') {
      node.autoStory = node.children[0].story;
      node.children = [];
    }
  }

  function handleComponentClick(story: Story) {
    if (onComponentSelect) {
      onComponentSelect(story.id);
    }
    // Update focus to the clicked component
    const storyPath = Array.from(storyPathMap.entries()).find(([id]) => id === story.id)?.[1];
    if (storyPath && storyPath.length > 0) {
      focusedPath = storyPath[storyPath.length - 1];
    }
  }

  // Build flat list of visible nodes for keyboard navigation
  function buildFlatNodeList(): string[] {
    const flatList: string[] = [];

    function traverse(node: TreeNodeData) {
      flatList.push(node.path);

      // Only traverse children if node is expanded
      if (expandedNodes.has(node.path) && node.children && node.children.length > 0) {
        node.children.forEach(traverse);
      }
    }

    tree.forEach(traverse);
    return flatList;
  }

  const flatNodeList = $derived(buildFlatNodeList());

  // Handle keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '];
    if (!handledKeys.includes(event.key)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const currentIndex = focusedPath ? flatNodeList.indexOf(focusedPath) : -1;

    // Arrow Up/Down: Navigate through visible nodes
    if (event.key === 'ArrowDown') {
      const nextIndex = currentIndex < flatNodeList.length - 1 ? currentIndex + 1 : currentIndex;
      if (nextIndex !== currentIndex || currentIndex === -1) {
        focusedPath = flatNodeList[nextIndex];
      }
    } else if (event.key === 'ArrowUp') {
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      if (nextIndex !== currentIndex || currentIndex === -1) {
        focusedPath = flatNodeList[nextIndex];
      }
    }

    // Arrow Left/Right and Enter/Space: Interact with focused node
    if (focusedPath) {
      const focusedNode = findNodeByPath(tree, focusedPath);
      if (!focusedNode) return;

      if (event.key === 'ArrowRight') {
        // Expand node if it's a folder/category and collapsed
        if ((focusedNode.type === 'folder' || focusedNode.type === 'category') &&
            !expandedNodes.has(focusedPath)) {
          toggleNode(focusedPath);
        }
      } else if (event.key === 'ArrowLeft') {
        // Collapse node if it's a folder/category and expanded
        if ((focusedNode.type === 'folder' || focusedNode.type === 'category') &&
            expandedNodes.has(focusedPath)) {
          toggleNode(focusedPath);
        }
      } else if (event.key === 'Enter' || event.key === ' ') {
        // Activate the focused node
        if (focusedNode.type === 'component' && focusedNode.story) {
          handleComponentClick(focusedNode.story);
        } else if (focusedNode.type === 'folder' && focusedNode.autoStory) {
          handleComponentClick(focusedNode.autoStory);
        } else {
          toggleNode(focusedPath);
        }
      }
    }
  }

  // Helper to find node by path
  function findNodeByPath(nodes: TreeNodeData[], path: string): TreeNodeData | null {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const found = findNodeByPath(node.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  // Initialize focus on first item
  $effect(() => {
    if (flatNodeList.length > 0 && !focusedPath) {
      focusedPath = flatNodeList[0];
    }
  });

  // Auto-scroll to focused element
  $effect(() => {
    if (!focusedPath || !treeContainer) return;

    // Find the focused button element
    const focusedElement = treeContainer.querySelector(`button.focused`);
    if (focusedElement) {
      focusedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  });

  $effect(() => {
    if (!selectedStoryId) return;
    const nodesToExpand = storyPathMap.get(selectedStoryId);
    if (!nodesToExpand || nodesToExpand.length === 0) return;

    const updated = new Set(expandedNodes);
    let changed = false;

    nodesToExpand.forEach(path => {
      if (!updated.has(path)) {
        updated.add(path);
        changed = true;
      }
    });

    if (changed) {
      expandedNodes = updated;
    }
  });
</script>

<div
  bind:this={treeContainer}
  class="tree-container bg-white dark:bg-gray-900 p-3"
  tabindex="0"
  onkeydown={handleKeyDown}
  role="tree"
  aria-label="Component tree"
>
  <nav class="space-y-1">
    {#each tree as categoryNode}
      <TreeNode
        node={categoryNode}
        level={0}
        {expandedNodes}
        {categoryConfig}
        onToggle={toggleNode}
        onComponentClick={handleComponentClick}
        {selectedStoryId}
        {focusedPath}
      />
    {/each}
  </nav>
</div>

<style>
  .tree-container {
    height: 100%;
    min-height: 0;
    overflow-y: scroll !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch;
  }

  .tree-container:focus {
    outline: none;
  }

  /* Custom scrollbar */
  .tree-container::-webkit-scrollbar {
    width: 8px;
  }

  .tree-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  .tree-container::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 4px;
  }

  .tree-container::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
  }

  :global(.dark) .tree-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  :global(.dark) .tree-container::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.5);
  }

  :global(.dark) .tree-container::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.7);
  }
</style>
