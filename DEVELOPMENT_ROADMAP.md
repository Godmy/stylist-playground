# Stylist Playground - Development Roadmap

> **Vision**: Создать современный, быстрый и интуитивный инструмент для разработки и документирования Svelte компонентов - аналог Histoire, оптимизированный для экосистемы Svelte 5 + SvelteKit.

---

## 🎯 Цели проекта

### Основные принципы
1. **Скорость превыше всего** - мгновенная загрузка, HMR, навигация
2. **Простота использования** - минимальная настройка, интуитивный интерфейс
3. **Мощные возможности** - всё необходимое для разработки компонентов из коробки
4. **Расширяемость** - плагины, темы, кастомизация

### Целевая аудитория
- Разработчики UI компонентов
- Команды дизайн-систем
- Документаторы API
- QA инженеры
- AI-агенты для тестирования

---

## 📊 Сравнение с Histoire

| Функция | Histoire | Stylist Playground (Цель) | Приоритет |
|---------|----------|---------------------------|-----------|
| **Производительность** |
| Vite-powered | ✅ | ✅ (Уже есть) | - |
| HMR < 100ms | ✅ | ✅ (Уже есть) | - |
| **Истории и организация** |
| Story файлы | ✅ `.story.vue` | 🔄 `.story.svelte` | P0 |
| Автообнаружение stories | ✅ | 🔴 Нет | P0 |
| Группировка по категориям | ✅ | 🟡 Частично | P0 |
| Варианты (Variants) | ✅ | 🔴 Нет | P1 |
| Grid layout для вариантов | ✅ | 🔴 Нет | P2 |
| **Интерактивность** |
| Controls (props editor) | ✅ | 🟡 Базовые | P0 |
| Event tracking | ✅ | 🔴 Нет | P1 |
| Actions/Interactions | ✅ | 🔴 Нет | P2 |
| **Документация** |
| Markdown поддержка | ✅ | 🔴 Нет | P1 |
| Code snippets | ✅ | 🔴 Нет | P1 |
| Syntax highlighting | ✅ | 🔴 Нет | P1 |
| **Генерация кода** |
| Автогенерация template | ✅ | 🔴 Нет | P0 |
| Copy to clipboard | ✅ | 🔴 Нет | P0 |
| Разные форматы (Vue/React) | ✅ | 🔴 Нет | P3 |
| **Визуальные инструменты** |
| Dark mode | ✅ | ✅ (Уже есть) | - |
| Responsive viewport | ✅ | 🔴 Нет | P1 |
| Background selector | ✅ | 🔴 Нет | P1 |
| Grid/Ruler overlay | ✅ | 🔴 Нет | P2 |
| **Тестирование** |
| Visual regression (Percy) | ✅ | 🔴 Нет | P3 |
| Accessibility checks | 🟡 Partial | 🔴 Нет | P2 |
| **Расширяемость** |
| Plugin API | ✅ | 🔴 Нет | P2 |
| Custom themes | ✅ | 🔴 Нет | P3 |
| **Уникальные функции Stylist** |
| AI-friendly API | - | 🔄 В разработке | P1 |
| Component analytics | - | 🔴 Planned | P3 |
| Design token inspector | - | 🔴 Planned | P2 |

**Легенда приоритетов:**
- **P0** - Критично для MVP
- **P1** - Важно для полноценного продукта
- **P2** - Улучшает UX, но не обязательно
- **P3** - Nice to have, долгосрочная перспектива

---

## 🗺️ Дорожная карта развития

### **Milestone 1: MVP - Functional Parity (4-6 недель)**

#### Цель
Создать минимально функциональный продукт, который может заменить базовые функции Histoire для Svelte проектов.

#### Ключевые функции

**1. Автообнаружение Stories (Week 1-2)**
```typescript
// Автоматический импорт всех .story.svelte файлов
const stories = import.meta.glob('../../../stylist-svelte/**/*.story.svelte', {
  eager: true
});
```

**Задачи:**
- ✅ Парсинг story файлов из stylist-svelte
- ✅ Динамическая загрузка компонентов
- ✅ Извлечение метаданных (title, category, tags)
- ✅ Построение навигационного дерева
- ✅ URL routing для каждой story

**Критерии успеха:**
- Все 14+ stories загружаются автоматически
- Навигация работает без багов
- URL совместимость (прямые ссылки работают)

---

**2. Controls Panel Upgrade (Week 2-3)**

**Текущие проблемы:**
- Простые text inputs для всех типов
- Нет типизации
- Нет валидации

**Новая реализация:**
```svelte
<!-- Автоматическое определение типа control по типу prop -->
<script lang="ts">
  interface ControlConfig {
    type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'date' | 'range';
    label: string;
    defaultValue: any;
    options?: any[]; // для select
    min?: number; // для number/range
    max?: number;
    step?: number;
  }

  // Автоматическая генерация controls из TypeScript типов компонента
  function generateControls(component: SvelteComponent): ControlConfig[] {
    // Парсинг TS интерфейса props
    // Маппинг типов на control типы
  }
</script>
```

**Типы controls:**
- `string` → Text input
- `number` → Number input с min/max
- `boolean` → Toggle switch
- `enum/union` → Select dropdown
- `color` → Color picker
- `date` → Date picker
- `function` → Event logger

**Задачи:**
- ✅ Типизированные controls
- ✅ Группировка controls (Appearance, State, Content)
- ✅ Reset to defaults кнопка
- ✅ Debounced updates (300ms)
- ✅ Keyboard shortcuts (Ctrl+R для reset)

---

**3. Code Generation Engine (Week 3-4)**

**Функционал:**
```svelte
<CodeViewer>
  {#snippet generated()}
    <Button
      variant="{variant}"
      size="{size}"
      {disabled}
      onclick={() => console.log('clicked')}
    >
      {buttonText}
    </Button>
  {/snippet}

  {#snippet formatted()}
    <!-- Форматированный код с подсветкой -->
  {/snippet}

  {#snippet minified()}
    <!-- Минифицированная версия -->
  {/snippet}
</CodeViewer>
```

**Задачи:**
- ✅ Генерация Svelte кода из состояния controls
- ✅ Syntax highlighting (Shiki)
- ✅ Copy to clipboard
- ✅ Export to file (.svelte)
- ✅ Форматирование через Prettier
- ✅ Показ только измененных props

**Дополнительно:**
- Генерация импортов
- Опциональный показ TypeScript типов
- Режим "только template" vs "полный компонент"

---

**4. Responsive Viewport System (Week 4)**

**Предустановки:**
```typescript
const viewports = {
  mobile: { width: 375, height: 667, label: 'iPhone SE' },
  tablet: { width: 768, height: 1024, label: 'iPad' },
  desktop: { width: 1440, height: 900, label: 'Desktop' },
  wide: { width: 1920, height: 1080, label: 'Full HD' },
  custom: { width: null, height: null, label: 'Custom' }
};
```

**UI:**
- Dropdown selector с предустановками
- Custom width/height inputs
- Rotate (landscape/portrait)
- Zoom controls (50% - 200%)
- Resize handles с live preview

**Задачи:**
- ✅ Viewport switcher в toolbar
- ✅ Анимированные transitions между размерами
- ✅ Persist viewport preference (localStorage)
- ✅ Keyboard shortcuts (1-5 для быстрого переключения)

---

**5. Background & Canvas Controls (Week 5)**

**Варианты фона:**
- Сплошные цвета (white, gray-50, gray-900)
- Прозрачный (checkerboard pattern)
- Градиенты
- Custom color picker

**Дополнительно:**
- Padding controls (none, sm, md, lg)
- Center/left/right alignment
- Grid overlay (8px, 4px)
- Ruler (показать размеры в px)

---

**6. Markdown Documentation (Week 5-6)**

**Интеграция:**
```svelte
<!-- Button.story.svelte -->
<script lang="ts">
  import Button from './Button.svelte';
  import { Story } from 'stylist-playground';
</script>

<Story title="Button" category="atoms">
  {#snippet docs()}
    # Button Component

    Primary action component for user interactions.

    ## Usage

    ```svelte
    <Button variant="primary">Click me</Button>
    ```

    ## Accessibility

    - Uses semantic `<button>` element
    - Keyboard navigable
    - Screen reader friendly
  {/snippet}

  {#snippet component(props)}
    <Button {...props}>Button text</Button>
  {/snippet}
</Story>
```

**Задачи:**
- ✅ Markdown parser (marked.js)
- ✅ Syntax highlighting для code blocks
- ✅ Tabs: Preview | Docs | Code
- ✅ Table of contents для длинных docs
- ✅ Anchor links для заголовков

---

### **Milestone 2: Enhanced UX (6-8 недель)**

#### Цель
Улучшить пользовательский опыт до уровня профессионального инструмента.

**1. Story Variants System (Week 7)**

Поддержка множественных вариантов одного компонента:

```svelte
<Story title="Button" category="atoms">
  <Variant name="Primary" props={{ variant: 'primary' }} />
  <Variant name="Secondary" props={{ variant: 'secondary' }} />
  <Variant name="Disabled" props={{ variant: 'primary', disabled: true }} />
  <Variant name="Loading" props={{ variant: 'primary', loading: true }} />
  <Variant name="With Icon" props={{ variant: 'primary', icon: 'arrow-right' }} />
</Story>
```

**Grid Layout:**
```
┌─────────────┬─────────────┬─────────────┐
│  Primary    │  Secondary  │  Disabled   │
│  [Button]   │  [Button]   │  [Button]   │
├─────────────┼─────────────┼─────────────┤
│  Loading    │  With Icon  │             │
│  [Button]   │  [Button]   │             │
└─────────────┴─────────────┴─────────────┘
```

**Функции:**
- ✅ Grid/List/Stack layouts
- ✅ Bulk screenshot (все варианты сразу)
- ✅ Compare mode (side-by-side)
- ✅ Filter/search variants

---

**2. Event Tracking Panel (Week 7-8)**

Логирование всех событий компонента:

```svelte
<EventTracker>
  <Button
    onclick={(e) => trackEvent('click', e)}
    onfocus={(e) => trackEvent('focus', e)}
    onblur={(e) => trackEvent('blur', e)}
  >
    Click me
  </Button>
</EventTracker>

<!-- Панель событий -->
<EventLog>
  <Event type="click" timestamp="12:34:56.789" detail={...} />
  <Event type="focus" timestamp="12:34:50.123" detail={...} />
</EventLog>
```

**Функции:**
- ✅ Real-time event stream
- ✅ Event filtering по типу
- ✅ Expandable event details (JSON)
- ✅ Clear log кнопка
- ✅ Export events to JSON

---

**3. Search & Navigation Improvements (Week 8)**

**Global Search (Cmd+K / Ctrl+K):**
```
┌────────────────────────────────────────┐
│ 🔍 Search components...                │
├────────────────────────────────────────┤
│ 📦 Button                   atoms/     │
│ 📦 Input                    atoms/     │
│ 📦 ButtonGroup              molecules/ │
│ 📄 Getting Started          docs/      │
│ 📝 Changelog                docs/      │
└────────────────────────────────────────┘
```

**Функции:**
- Fuzzy search по названиям
- Поиск по тегам
- Поиск по содержимому docs
- Recent items history
- Keyboard navigation

**Navigator improvements:**
- Collapsible categories
- Badges (NEW, UPDATED, DEPRECATED)
- Component previews on hover
- Drag & drop для custom ordering
- Favorites/bookmarks

---

**4. Accessibility Inspector (Week 8)**

**Автоматические проверки:**
```typescript
interface A11yChecks {
  contrast: {
    passed: boolean;
    ratio: number;
    requiredRatio: number;
  };
  semantics: {
    hasRole: boolean;
    hasLabel: boolean;
    hasDescription: boolean;
  };
  keyboard: {
    focusable: boolean;
    hasTabIndex: boolean;
    keyboardHandlers: string[];
  };
  aria: {
    ariaLabel?: string;
    ariaDescribedBy?: string;
    ariaLive?: string;
  };
}
```

**UI Panel:**
- ✅ Live contrast checker
- ✅ ARIA attributes inspector
- ✅ Keyboard navigation test
- ✅ Screen reader preview
- ✅ WCAG compliance score

---

### **Milestone 3: Advanced Features (8-12 недель)**

#### Цель
Добавить продвинутые функции для профессиональной работы.

**1. Visual Regression Testing (Week 9-10)**

**Интеграция с Percy/Lost Pixel:**
```bash
# CI/CD pipeline
npm run playground:build
npx percy snapshot stories/
```

**Локальная разработка:**
```typescript
// Автоматические снимки при изменении
watch('**/*.story.svelte', async (file) => {
  await captureSnapshot(file);
  await compareWithBaseline(file);
  if (hasDifferences) {
    notifyDeveloper(differences);
  }
});
```

**Функции:**
- ✅ Baseline snapshots
- ✅ Diff viewer (side-by-side)
- ✅ Approve/reject changes
- ✅ History tracking
- ✅ CI integration

---

**2. Design Token Inspector (Week 10-11)**

**Визуализация дизайн-токенов:**
```svelte
<TokenInspector component={Button}>
  <TokenGroup name="Colors">
    <Token name="--color-primary" value="#6366f1" used={true} />
    <Token name="--color-primary-hover" value="#4f46e5" used={true} />
  </TokenGroup>

  <TokenGroup name="Spacing">
    <Token name="--spacing-md" value="1rem" used={true} />
    <Token name="--spacing-lg" value="1.5rem" used={false} />
  </TokenGroup>

  <TokenGroup name="Typography">
    <Token name="--font-size-base" value="1rem" used={true} />
  </TokenGroup>
</TokenInspector>
```

**Функции:**
- Автоматическое извлечение CSS custom properties
- Показать где используется токен
- Редактор значений (live preview)
- Export tokens to JSON/CSS/SCSS
- Unused tokens detection

---

**3. Plugin System (Week 11-12)**

**API для плагинов:**
```typescript
interface PlaygroundPlugin {
  name: string;
  version: string;

  // Lifecycle hooks
  onInit?(playground: PlaygroundAPI): void;
  onStoryLoad?(story: Story): void;
  onControlChange?(control: Control, value: any): void;

  // UI extensions
  toolbar?: ToolbarButton[];
  panels?: Panel[];
  tabs?: Tab[];

  // Story transformers
  transformStory?(story: Story): Story;
}

// Пример плагина
export const figmaPlugin: PlaygroundPlugin = {
  name: '@stylist/figma-plugin',
  version: '1.0.0',

  toolbar: [{
    icon: 'figma',
    label: 'Export to Figma',
    onClick: async (story) => {
      await exportToFigma(story);
    }
  }],

  panels: [{
    id: 'figma-sync',
    title: 'Figma Sync',
    component: FigmaPanel
  }]
};
```

**Официальные плагины:**
- `@stylist/analytics` - Usage analytics
- `@stylist/figma` - Figma integration
- `@stylist/chromatic` - Visual testing
- `@stylist/measure` - Performance profiling

---

**4. Performance Profiler (Week 12)**

**Метрики компонента:**
```typescript
interface ComponentMetrics {
  renderTime: number; // ms
  bundleSize: number; // KB
  cssSize: number; // KB
  reRenders: number;
  propsChanges: Map<string, number>;

  // Lighthouse-style scores
  performance: number; // 0-100
  accessibility: number; // 0-100
  bestPractices: number; // 0-100
}
```

**UI:**
- Real-time render time graph
- Bundle size analyzer
- Re-render tracker
- Memory usage
- CPU usage

---

### **Milestone 4: Production Ready (12-16 недель)**

#### Цель
Стабилизация, оптимизация, подготовка к релизу.

**1. Build & Deploy (Week 13)**

**Static export:**
```bash
npm run playground:build
# Генерирует статический сайт в ./build/
# Деплой на Vercel/Netlify/GitHub Pages
```

**Функции:**
- ✅ SSG для всех stories
- ✅ Optimized assets (code splitting)
- ✅ Sitemap generation
- ✅ SEO meta tags
- ✅ Open Graph images

---

**2. Collaboration Features (Week 14)**

**Комментарии:**
```svelte
<CommentThread storyId="atoms-button" variantId="primary">
  <Comment
    author="designer@example.com"
    timestamp={new Date()}
    text="Can we make the border-radius larger?"
  >
    <Reply
      author="developer@example.com"
      text="Sure, I'll update it to 8px"
    />
  </Comment>
</CommentThread>
```

**Функции:**
- Thread-based comments
- @mentions
- Email notifications
- Resolve/unresolve
- Comment export to Jira/Linear

---

**3. Internationalization (Week 15)**

**UI локализация:**
```typescript
const translations = {
  en: {
    'toolbar.viewport': 'Viewport',
    'toolbar.background': 'Background',
    'controls.reset': 'Reset to defaults'
  },
  ru: {
    'toolbar.viewport': 'Viewport',
    'toolbar.background': 'Фон',
    'controls.reset': 'Сбросить'
  }
};
```

**Поддержка:**
- English (default)
- Русский
- Español
- Français
- Deutsch
- 中文

---

**4. Documentation & Examples (Week 16)**

**Контент:**
- Getting Started guide
- Story writing tutorial
- API reference
- Best practices
- Migration guide (from Histoire)
- Video tutorials
- Interactive playground tour

---

## 🛠️ Технический стек

### Core
- **Framework:** SvelteKit 2.x + Svelte 5
- **Build:** Vite 7.x
- **Styling:** Tailwind CSS 4.x
- **Language:** TypeScript 5.x

### Story System
- **Discovery:** `import.meta.glob()` (Vite API)
- **Parsing:** Custom AST parser (svelte-parser)
- **Routing:** SvelteKit filesystem routing

### Code Generation
- **Syntax Highlight:** Shiki
- **Formatting:** Prettier + prettier-plugin-svelte
- **AST Manipulation:** acorn / babel

### Documentation
- **Markdown:** marked.js
- **Code Blocks:** Shiki
- **Diagrams:** Mermaid.js (optional)

### Testing
- **Visual Regression:** Percy / Lost Pixel
- **A11y:** axe-core
- **Performance:** web-vitals

### UI Components
- **Base Library:** stylist-svelte
- **Icons:** lucide-svelte
- **Tooltips:** tippy.js
- **Notifications:** svelte-sonner

---

## 📈 Метрики успеха

### Performance
- [ ] Initial load < 1s (3G connection)
- [ ] HMR < 100ms
- [ ] Story navigation < 200ms
- [ ] Lighthouse score > 95

### Adoption
- [ ] 100+ GitHub stars (6 months)
- [ ] 10+ community stories
- [ ] 3+ external projects using it
- [ ] Featured on Svelte Society

### Feature Completeness
- [ ] 90% feature parity с Histoire
- [ ] 5+ unique features
- [ ] 0 critical bugs
- [ ] < 5 P1 bugs

### Developer Experience
- [ ] Setup time < 5 min
- [ ] Documentation completeness > 80%
- [ ] 0 confusion points
- [ ] Positive community feedback

---

## 🚀 Release Plan

### v0.1.0 - Alpha (Week 6)
- Внутреннее тестирование
- Друзья и близкие
- Feedback collection

### v0.5.0 - Beta (Week 10)
- Public announcement
- Svelte Discord/Reddit
- Early adopters program

### v1.0.0 - Stable (Week 16)
- Production ready
- Full documentation
- Migration guide
- Launch event

---

## 🤝 Contributing

### Как помочь
1. **Тестирование** - попробуйте playground на своих компонентах
2. **Feedback** - предложите улучшения
3. **Code** - сделайте PR с фичами/багфиксами
4. **Docs** - улучшите документацию
5. **Examples** - создайте примеры stories

### Roadmap участников
- Anyone can work on P2/P3 features
- P0/P1 require discussion
- All PRs need review + tests

---

## 📝 Заметки

### Отличия от Histoire
1. **Svelte-first** - оптимизирован для Svelte 5 (не Vue)
2. **SvelteKit integration** - использует возможности SvelteKit
3. **Runes support** - работает с $state, $derived, $effect
4. **AI-friendly** - специальные API для AI агентов
5. **Modern stack** - Vite 7, Tailwind 4, TypeScript 5

### Что НЕ планируется
- ❌ Поддержка Vue/React (только Svelte)
- ❌ Custom bundler (только Vite)
- ❌ Legacy Svelte < 5 (только Svelte 5+)

---

## 🎉 Заключение

Этот roadmap - живой документ. Он будет обновляться по мере развития проекта и получения feedback от сообщества.

**Следующий шаг:** Начать с Milestone 1, Week 1 - автообнаружение stories.

---

*Последнее обновление: 2025-11-07*