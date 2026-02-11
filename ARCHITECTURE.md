# Stylist Playground Architecture

## Overview

`stylist-playground` is a SvelteKit application for interactive exploration, validation, and documentation of `stylist-svelte` components.

The playground is intentionally split into:

- local application logic (`src/lib/components`, local store, panels, utilities),
- shared UI contracts and components from `stylist-svelte` (`workspace:*` dependency).

This allows fast iteration in the playground while keeping UI rules centralized in the library.

## Integration With `stylist-svelte`

### Dependency model

- `stylist-svelte` is consumed as `workspace:*`.
- Playground runtime code (store, utilities, app panels) lives locally in `src/lib`.
- Design-system and component contracts come from `stylist-svelte`.

### Aliases

Configured in `svelte.config.js`:

- `$lib` -> `./src/lib`
- `$playground` -> `./src/lib`
- `$stylist` -> `../stylist-svelte/src/lib`
- `@stylist-svelte` -> `../stylist-svelte/src/lib`

## Core State Layer

The central state is `playgroundStore` in:

- `src/lib/components/stores/playground.svelte.ts`

### Responsibilities

- Story registry (`registerStory`, `unregisterStory`, `getStoriesByCategory`)
- Active story and control values (`setCurrentStory`, `updateControl`)
- Canvas/layout state (viewport, grid, zoom, panel visibility)
- Theme switching (`toggleDarkMode`, `init`) via `applyThemeToDOM`
- URL synchronization (`restoreFromURL`, `syncToURL`, `getShareURL`)
- Presets management (save/load/favorite/duplicate/rename/delete)
- History tracking (recent/most visited/stats)
- Notification API (`success`, `error`, `warning`, `info`)
- Local persistence (`playground-state`, theme keys)

### Theme behavior

Theme flow is driven by design-system and synchronized with DOM:

1. Theme is resolved from storage and/or system preference in `init()`.
2. `applyThemeToDOM(theme)` applies CSS variables.
3. `data-theme` and Tailwind `dark` class are synchronized on `document.documentElement`.
4. Theme value is persisted to `stylist-theme` and legacy `theme` key.

## Component Structure

Main UI modules in `src/lib/components/playground` include:

- `PlaygroundToolbar`
- `PlaygroundSidebar`
- `Canvas`
- `PlaygroundControlPanel`
- `BottomPanel`
- `ComponentTree`
- `Story` / `StoryRoot`
- `AIPanel`, `AIChat`, `AIAssistant`
- utility panels (`AccessibilityPanel`, `VariantsPanel`, `PresetsPanel`, `HistoryPanel`, etc.)

## Vite Runtime Architecture

`vite.config.ts` contains three key integration layers:

1. `createErrorLoggerPlugin()`
- Hooks into dev logger and watcher errors.
- Writes logs to `logs/dev-errors`.
- Produces:
  - session logs: `logs/dev-errors/session-*.log`
  - component logs: `logs/dev-errors/components/**/<component>.log`

2. `watchAndRun`
- Watches `logs/dev-errors/**/*.log`.
- Runs `node scripts/process-logs.mjs` with 500ms debounce.

3. `stylist-svelte-lib-resolver`
- Resolves `stylist-svelte/*` and `$lib/*` imports from library sources.
- Uses synchronous file existence checks with cache for fast hot reload.

## Data Boundaries

### Playground-owned

- Story navigation behavior
- URL/preset/history storage
- AI panel and non-library UX tooling
- Logging and log processing

### Library-owned (`stylist-svelte`)

- UI components
- design-system tokens/themes/classes/state helpers
- type contracts exported by library modules

## Operational Notes

- Dev filesystem access is explicitly allowed for parent directories (`server.fs.allow = ['..']`).
- Log processing is dev-only and attached to Vite serve mode.
- `optimizeDeps.include` pre-bundles `lucide-svelte` and `shiki` for faster startup.

## Recommended Usage Pattern

1. Start playground (`yarn dev` in `stylist-playground`).
2. Let stories register themselves through `Story`/`StoryRoot`.
3. Initialize store once at app root (`playgroundStore.init()`).
4. Keep component contracts in `stylist-svelte`; keep playground behavior in local modules.
5. Use URL/presets/history as first-class debugging and review tools.
