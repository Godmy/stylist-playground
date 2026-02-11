# Stylist Playground Logging System

## Overview

Playground has a dev-time logging pipeline that captures runtime/build errors, stores them in structured files, and automatically runs log analysis.

Pipeline parts:

1. Vite logging plugin (`createErrorLoggerPlugin` in `vite.config.ts`).
2. File watcher (`vite-plugin-watch-and-run`).
3. Processor script (`scripts/process-logs.mjs`).

## Log Storage Layout

Root directory:

- `logs/dev-errors/`

Main artifacts:

- session logs: `logs/dev-errors/session-<timestamp>.log`
- component logs: `logs/dev-errors/components/**/<component>.log`

Component grouping:

- `atoms/`
- `molecules/`
- `organisms/`
- fallback to `components/` root when component group cannot be resolved

## How Logging Works

### 1) Error capture

In dev mode (`apply: 'serve'`) plugin intercepts:

- Vite logger errors (`server.config.logger.error`)
- watcher-level errors (`server.watcher.on('event')` with `ERROR`)

Each event is normalized into:

- message
- optional stack
- timestamp

### 2) Target log resolution

Plugin attempts to map error context to a concrete component path:

- if stack/message references `stylist-svelte/src/lib/components/(atoms|molecules|organisms)/...`,
  log goes into matching subgroup directory,
- otherwise logs go to fallback location under `components/`.

Log filename is derived from source file basename (sanitized slug).

### 3) Entry writing model

For each captured error:

- component log is written with:
  - `message` block
  - `stack` block
  - SHA-256 hash for each block
- session log appends chronological raw entries.

### 4) Automatic processing

Watcher config:

- watch pattern: `logs/dev-errors/**/*.log`
- command: `node scripts/process-logs.mjs`
- debounce delay: `500ms`

This keeps console diagnostics synchronized with latest file logs.

## Practical Workflow

1. Run playground:

```bash
yarn dev
```

2. Reproduce issue in UI.
3. Inspect:

- `logs/dev-errors/session-*.log`
- `logs/dev-errors/components/**/*.log`

4. Run manual processing when needed:

```bash
node scripts/process-logs.mjs
```

## Design Properties

- Dev-only behavior (no production overhead).
- Deterministic file layout.
- Per-component isolation of logs.
- Session timeline for chronological debugging.
- Duplicate burst suppression via short signature window.

## Configuration Touchpoints

- `vite.config.ts`
  - `createErrorLoggerPlugin()`
  - `watchAndRun([...])`
- `scripts/process-logs.mjs`

## Extending the System

Typical extension points:

1. Add richer parser rules in `scripts/process-logs.mjs`.
2. Add severity routing (warn/error/fatal) in plugin writer.
3. Introduce external reporters (e.g. webhook/issue integration) from processing script.
4. Add retention/cleanup policy for old session files.

Keep file format stable if external tooling reads logs.
