# Stylist Playground

Interactive development and testing environment for [stylist-svelte](../stylist-svelte) components.

**Note**: This project is part of the Stylist ecosystem. See [ECOSYSTEM_ARCHITECTURE.md](../../ECOSYSTEM_ARCHITECTURE.md) for details on the architecture and responsibilities of each project.

## Purpose

Stylist Playground serves as:

1. **Interactive Development Environment** – test components with live prop controls and real-time feedback.
2. **Component Documentation** – generate examples and code snippets for component usage.
3. **Design QA** – review visual states and theme variations before shipping to production.
4. **AI Integration** – provide a controlled environment for automated component testing.
5. **Story Management** – organize and manage component examples and use cases.

## Features

- Full SvelteKit application with Tailwind CSS preconfigured.
- Hot Module Replacement for quick feedback loops.
- Access to the shared UI library through `workspace:*` dependency.

## Getting Started

### Prerequisites

- Node.js 18+
- yarn (workspace mode)

### Installation

```bash
# From repository root
yarn install

# Start development server
cd packages/stylist-playground
yarn dev

# Open http://localhost:5173
```

### Library Integration

This playground uses the library store from `@stylist-svelte/playground`. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed information about:

- How the library is connected
- Import aliases and paths
- Store management
- Theme system
- Performance optimizations

## Project Structure

```
stylist/
├── src/
│   ├── routes/            # SvelteKit pages
│   │   ├── +layout.svelte # Root layout
│   │   └── +page.svelte   # Home page
│   ├── app.css            # Global styles
│   ├── app.d.ts           # Type declarations
│   └── app.html           # HTML template
├── svelte.config.js       # Svelte configuration (adapter-node)
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config
└── package.json
```

## Usage

Import components from `stylist-svelte` and iterate directly in Svelte pages:

```svelte
<script lang="ts">
  import { Button, Input, Modal } from 'stylist-svelte';

  let name = $state('');
  let showModal = $state(false);
</script>

<div class="p-8 space-y-4">
  <Input
    bind:value={name}
    label="Your Name"
    placeholder="Enter your name"
  />

  <Button onclick={() => (showModal = true)} variant="primary">
    Open Modal
  </Button>

  {#if showModal}
    <Modal bind:open={showModal}>
      <h2>Hello {name}!</h2>
    </Modal>
  {/if}
</div>
```

## Development Workflow

1. **Develop** – update components in `stylist-svelte`.
2. **Test** – exercise changes inside this playground.
3. **Document** – record usage notes alongside the components or in shared docs.
4. **Iterate** – refine based on manual or automated feedback.

## AI Integration

The playground is designed to be AI-friendly:

- Self-contained environment with clear examples.
- Simple command surface (`npm run dev`, `npm run build`, etc.).
- No external tooling requirements.

Agents can use it to learn component APIs, explore variations, and validate implementations without touching production code.

## Scripts

```bash
# Development
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build

# Quality
npm run check        # Type check
npm run check:watch  # Type check (watch mode)
npm run lint         # Lint code
npm run format       # Format code
```

## License

MIT License – see [LICENSE](./LICENSE) for details.

## Related

- [stylist-svelte](../stylist-svelte) – UI component library
- [HumansOntology](../../) – Main project
