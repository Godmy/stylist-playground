# Stylist Playground Architecture

## Overview

Stylist Playground is a full-featured component documentation and testing environment built on top of the `stylist-svelte` library.

## Library Integration

### How the Library is Connected

The playground uses the `stylist-svelte` library in workspace mode:

```json
// package.json
{
  "dependencies": {
    "stylist-svelte": "workspace:*"
  }
}
```

### Import Aliases

The project uses SvelteKit aliases for convenient imports:

```js
// svelte.config.js
{
  alias: {
    // Playground's own components
    $lib: './src/lib',

    // Direct access to stylist-svelte library
    '@stylist-svelte': '../stylist-svelte/src/lib',

    // Playground store and types from the library
    '@stylist-svelte/playground': '../stylist-svelte/src/lib/playground'
  }
}
```

## Shared State Management

The playground uses the **library's playground store** (`playgroundStore`) from `@stylist-svelte/playground`, not a local duplicate.

### Store Features

The `playgroundStore` from the library provides:

- **State Management**: `state.darkMode`, `state.viewport`, `state.sidebarOpen`, etc.
- **UI State**: `uiState.showGrid`, `uiState.zoom`, `uiState.background`
- **Story Management**: `stories` Map, `registerStory()`, `getCurrentStory()`
- **Control Values**: `controlValues`, `updateControl()`
- **Theme Management**: `toggleDarkMode()`, `init()` with localStorage and system preference detection

### Usage Example

```svelte
<script lang="ts">
  import { playgroundStore } from '@stylist-svelte/playground';
  import { onMount } from 'svelte';

  onMount(() => {
    // Initialize theme from localStorage/system
    playgroundStore.init();
  });
</script>

<button onclick={() => playgroundStore.toggleDarkMode()}>
  Toggle Theme
</button>

{#if playgroundStore.state.darkMode}
  <span>Dark Mode Active</span>
{/if}
```

## Vite Configuration

Custom plugin for resolving `$lib` imports in library components:

```ts
// vite.config.ts
{
  name: 'stylist-svelte-lib-resolver',
  resolveId(source, importer) {
    // Resolves $lib imports from stylist-svelte package
    // to actual file paths
  }
}
```

## Component Structure

### From Library (`@stylist-svelte/playground`)
- `playgroundStore` - Central state management
- `Story` - Story wrapper component
- `ControlConfig`, `StoryConfig` - Type definitions

### Playground App (local)
- `PlaygroundToolbar` - Top toolbar with viewport controls
- `PlaygroundSidebar` - Left sidebar for navigation
- `ComponentCanvas` - Main canvas with zoom/grid
- `ControlsPanel` - Interactive controls panel
- `BottomPanel` - Bottom panel layout

## Theme System

### How Dark Mode Works

1. **Initialization** (`playgroundStore.init()`):
   - Checks `localStorage.theme`
   - Falls back to system preference: `prefers-color-scheme: dark`
   - Applies `dark` class to `document.documentElement`

2. **Toggle** (`playgroundStore.toggleDarkMode()`):
   - Flips `state.darkMode`
   - Updates DOM class
   - Saves to localStorage

3. **CSS** (Tailwind):
   - Uses `dark:` variant for styling
   - Example: `bg-white dark:bg-gray-900`

### Initial Theme Loading

The `app.html` includes inline script to prevent FOUC (Flash of Unstyled Content):

```html
<script>
  if (localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
</script>
```

## Best Practices

1. **Always use library store**: Import from `@stylist-svelte/playground`, not local duplicates
2. **Initialize on mount**: Call `playgroundStore.init()` in root layout
3. **Access state directly**: Use `playgroundStore.state.xxx` and `playgroundStore.uiState.xxx`
4. **Story registration**: Let `Story` component handle registration automatically

## Performance Optimizations

1. **Vite resolver caching**: File path resolution results are cached
2. **Synchronous resolution**: Uses `fs.existsSync()` instead of async operations
3. **Pre-bundling**: `optimizeDeps.include` for frequently used dependencies
