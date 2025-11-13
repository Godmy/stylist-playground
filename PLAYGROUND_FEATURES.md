# 🎨 Stylist Playground v0.2.0 - World-Class Component Explorer

## 🌟 Overview

Welcome to the most advanced Svelte 5 component playground in the world! Built with cutting-edge technologies and designed for developers who demand excellence.

## ✨ Features

### 🏠 **Dashboard**
- **Smart Component Search** - Lightning-fast fuzzy search with real-time highlighting
- **Live Statistics** - Real-time metrics for all components
- **Visual Component Grid** - Beautiful cards with category-based color coding
- **Quick Navigation** - Instant access to any component

### 🎮 **Interactive Playground**

#### **Layout Components**
1. **PlaygroundToolbar**
   - Responsive viewport controls (Mobile, Tablet, Desktop, Fullscreen)
   - Grid overlay toggle
   - Dark mode switch
   - Quick actions (Copy, Download, Settings)

2. **PlaygroundSidebar** (5 Tabs)
   - **Variants** - Pre-configured component states
   - **Props** - Live prop values display
   - **Docs** - Auto-generated API documentation
   - **Code** - Usage examples
   - **A11y** - Accessibility audit

3. **ComponentCanvas**
   - Zoom controls (25% - 200%)
   - Background options (White, Gray, Dark, Transparent)
   - Grid overlay for alignment
   - Smooth animations

4. **BottomPanel** (3 Tabs)
   - **Controls** - Interactive prop editors
   - **Code** - Generated code with syntax highlighting
   - **Tokens** - Design system tokens

### 📚 **Advanced Panels**

#### **DocsPanel**
- Auto-generated API documentation
- Props table with types and defaults
- Events documentation
- Slots documentation
- Usage examples with copy-to-clipboard
- Direct links to GitHub

#### **A11yPanel**
- Real-time WCAG 2.1 AA compliance checks
- Visual accessibility score
- Category-based checks:
  - Keyboard Navigation
  - Screen Reader Support
  - Color Contrast
  - Focus Indicators
  - Semantic HTML
- Detailed audit reports
- Re-scan functionality

#### **DesignTokensPanel**
- Visual token inspector
- Category filters (Colors, Spacing, Typography, Shadows, etc.)
- Live previews:
  - Color swatches
  - Shadow demonstrations
  - Spacing bars
  - Radius visualizations
- Copy CSS variables
- Export options (CSS, JSON, Tailwind Config)

### 🔍 **Components Library Page**
- **Advanced Filtering**
  - Category filters
  - Tag filters
  - Search with highlighting
- **View Modes**
  - Grid view
  - List view
- **Sorting Options**
  - By name
  - By category
  - Recently updated
- **Empty States** - Helpful guidance when no results

### ⌨️ **Keyboard Shortcuts**
- `Ctrl+/` - Toggle sidebar
- `Ctrl+D` - Toggle dark mode
- `Ctrl+B` - Toggle bottom panel
- `Ctrl+G` - Toggle grid overlay
- `Ctrl+C` - Copy code
- All actions keyboard-accessible

## 🏗️ **Architecture**

### **State Management**
- Centralized playground store using Svelte 5 runes
- Reactive state with `$state` and `$derived`
- Clean, predictable state updates

### **Utilities**
- **Fuzzy Search** - Intelligent search algorithm
- **Code Generator** - Automatic Svelte code generation
- **Keyboard Shortcuts** - Extensible shortcut system

### **Component Structure**
```
src/
├── lib/
│   ├── stores/
│   │   └── playground.svelte.ts       # Central state management
│   ├── utils/
│   │   ├── keyboard-shortcuts.ts      # Keyboard navigation
│   │   ├── code-generator.ts          # Code generation
│   │   ├── fuzzy-search.ts            # Smart search
│   │   └── stories.ts                 # Component metadata
│   └── components/
│       └── playground/
│           ├── PlaygroundToolbar.svelte
│           ├── PlaygroundSidebar.svelte
│           ├── ComponentCanvas.svelte
│           ├── BottomPanel.svelte
│           ├── VariantsPanel.svelte
│           ├── DocsPanel.svelte
│           ├── A11yPanel.svelte
│           └── DesignTokensPanel.svelte
└── routes/
    ├── +page.svelte                   # Dashboard
    ├── components/
    │   └── +page.svelte              # Components library
    └── playground/
        └── [id]/
            ├── +page.ts              # Data loading
            └── +page.svelte          # Playground UI
```

## 🎯 **Performance**

- **Fast Navigation** - Instant route transitions
- **Optimized Rendering** - Virtual scrolling for large lists
- **Smart Caching** - Efficient component loading
- **Hot Module Replacement** - Lightning-fast development

## 🌈 **Design System**

### **Colors**
- Indigo/Purple gradient for primary actions
- Category-specific colors (Blue for Atoms, Purple for Molecules, Green for Organisms)
- Full dark mode support

### **Typography**
- System font stack for optimal performance
- Clear hierarchy with semantic sizes
- Monospace fonts for code

### **Spacing**
- Consistent 4px grid system
- Generous whitespace
- Balanced layouts

## 🚀 **Usage**

### **Development**
```bash
# Install dependencies
yarn install

# Start dev server
yarn workspace stylist-playground dev

# Check types
yarn workspace stylist-playground check

# Build for production
yarn workspace stylist-playground build
```

### **URLs**
- Dashboard: `http://localhost:5174/`
- Components: `http://localhost:5174/components`
- Playground: `http://localhost:5174/playground/[component-id]`

## 🎨 **Customization**

### **Adding New Components**
1. Create a `.story.svelte` file in the component directory
2. The playground auto-discovers and loads it
3. Add variants, props, and documentation

### **Extending Panels**
1. Create a new panel component
2. Add to `PlaygroundSidebar` or `BottomPanel`
3. Register keyboard shortcut if needed

## 📊 **Statistics**

- **Components**: 77+ (and growing)
- **Categories**: 3 (Atoms, Molecules, Organisms)
- **Subcategories**: 25+
- **Lines of Code**: 10,000+
- **Love**: ∞

## 🏆 **What Makes This Special**

1. **Best-in-Class UX** - Smooth, intuitive, delightful
2. **Svelte 5 Native** - Built with latest Svelte 5 runes
3. **Accessibility First** - WCAG 2.1 AA compliant
4. **Developer Experience** - Hot reload, keyboard shortcuts, smart search
5. **Visual Polish** - Every pixel matters
6. **Performance** - Lightning fast
7. **Extensible** - Easy to add new features

## 🌍 **For the World**

This playground is designed to be:
- **Educational** - Learn Svelte 5 and component design
- **Productive** - Build faster with ready-made components
- **Beautiful** - Showcase your design system
- **Accessible** - Inclusive by default
- **Open** - MIT licensed

## 🙏 **Credits**

Built with:
- Svelte 5
- SvelteKit
- Tailwind CSS 4
- TypeScript
- Vite
- Lucide Icons
- Love ❤️

---

**Made with passion for the developer community** 🚀

Visit: https://github.com/Godmy/stylist-svelte
