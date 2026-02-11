# Stylist Playground

Interactive SvelteKit environment for developing, validating, and documenting `stylist-svelte` components.

## Purpose

`stylist-playground` is used for:

1. Interactive component development with live controls.
2. Visual QA for variants, states, and themes.
3. Story-based documentation and API exploration.
4. Debugging via URL state, presets, history, and runtime logs.
5. Safe experimentation without touching production application code.

## What Is Included

- Full SvelteKit app with Tailwind CSS v4.
- Integration with `stylist-svelte` via workspace dependency.
- Local playground store and utility modules.
- Story canvas, side panels, toolbar, and bottom control area.
- Built-in dev logging pipeline for component/runtime errors.

## Quick Start

### Prerequisites

- Node.js 18+
- Yarn

### Install and run

```bash
# from repository root
yarn install

# run playground
cd stylist-playground
yarn dev
```

Open: `http://localhost:5173`

## Scripts

```bash
yarn dev          # start dev server
yarn build        # production build
yarn preview      # preview production build
yarn check        # svelte-check
yarn check:watch  # svelte-check in watch mode
yarn lint         # prettier + eslint
yarn format       # format files
yarn clean        # remove build/cache artifacts
```

## Library Integration Model

Playground architecture is intentionally split:

- **Library layer (`stylist-svelte`)**: components, design-system, shared contracts.
- **Playground layer (`src/lib`)**: app UI, local store, controls logic, URL state, presets, history, AI tooling.

Useful aliases (`svelte.config.js`):

- `$lib`, `$playground` -> local playground source
- `$stylist`, `@stylist-svelte` -> `../stylist-svelte/src/lib`

## State and UX System

Central store:

- `src/lib/components/stores/playground.svelte.ts`

Key capabilities:

- story registry and current story state,
- control values and live prop updates,
- theme/viewport/canvas settings,
- local persistence,
- URL sync and shareable links,
- presets and history management,
- in-app notifications.

## Logging and Diagnostics

Dev logging is integrated directly into Vite:

- session/component logs are written to `logs/dev-errors/**`,
- updates trigger `scripts/process-logs.mjs` via watcher,
- see `LOGGING_SYSTEM.md` for details.

## Project Structure (high-level)

```text
stylist-playground/
├─ src/
│  ├─ lib/
│  │  ├─ components/
│  │  │  ├─ playground/
│  │  │  ├─ stores/
│  │  │  └─ utils/
│  │  ├─ api/
│  │  ├─ types/
│  │  └─ utils/
│  └─ routes/
├─ scripts/
│  └─ process-logs.mjs
├─ logs/
├─ vite.config.ts
├─ svelte.config.js
└─ package.json
```

## Related Docs

- `ARCHITECTURE.md` - system architecture and boundaries
- `LOGGING_SYSTEM.md` - runtime logging pipeline
- `../stylist-svelte/src/lib/design-system/README.md` - design-system guide
