# План улучшения Stylist Playground

## Текущие проблемы

### Критические
1. **Stories не загружаются** - главная страница пустая, отображается "No stories found"
   - В `+layout.svelte` нет импорта story файлов из библиотеки
   - Компонент StoryRoot получает пустой `<slot />`
   - 14 готовых story файлов в `stylist-svelte` не используются

2. **"No controls available"** появляется, потому что нет активной story

3. **Архитектурная рассогласованность**
   - Есть отдельные страницы `/button` и `/input`, которые не интегрированы с playground
   - Дублирование компонентов Story между playground и stylist-svelte

### Второстепенные
4. **UI/UX недостатки**
   - Минималистичный дизайн без достаточного визуального разнообразия
   - Отсутствие визуальной обратной связи при взаимодействии
   - Недостаточно контента на главной странице

---

## План улучшений

### Фаза 1: Исправление критических проблем (Приоритет: ВЫСОКИЙ)

#### 1.1 Интеграция stories из stylist-svelte
**Файл:** `packages/stylist-playground/src/routes/+page.svelte`

**Текущий код:**
```svelte
<div class="min-h-screen...">
  <!-- Статичная welcome страница -->
</div>
```

**Необходимые изменения:**
```svelte
<script lang="ts">
  // Динамическая загрузка всех story файлов
  const storyModules = import.meta.glob(
    '../../../stylist-svelte/src/lib/components/**/*.story.svelte',
    { eager: true }
  );

  const stories = Object.entries(storyModules)
    .map(([path, module]) => ({
      path,
      component: module?.default
    }))
    .filter(entry => entry.component);
</script>

{#each stories as story (story.path)}
  <svelte:component this={story.component} />
{/each}
```

**Результат:**
- Все 14 stories будут автоматически загружены
- Исчезнет сообщение "No stories found"
- Playground станет функциональным

---

#### 1.2 Удаление дублирующих маршрутов
**Файлы к удалению:**
- `packages/stylist-playground/src/routes/button/+page.svelte`
- `packages/stylist-playground/src/routes/input/+page.svelte`

**Обоснование:**
- Эти страницы дублируют функционал playground
- Создают путаницу в навигации
- Не используют систему stories

---

### Фаза 2: Улучшение UI/UX (Приоритет: СРЕДНИЙ)

#### 2.1 Редизайн главной страницы
**Цель:** Сделать первый экран более информативным и привлекательным

**Предлагаемые изменения:**

1. **Hero секция с градиентом и анимацией**
```svelte
<div class="hero-section bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
  <h1 class="text-6xl font-bold text-white animate-fade-in">
    Stylist Component Library
  </h1>
  <p class="text-xl text-white/90">
    38+ компонентов для Svelte 5 с Tailwind CSS
  </p>
</div>
```

2. **Интерактивная статистика**
```svelte
<div class="stats-grid grid grid-cols-3 gap-6">
  <div class="stat-card">
    <div class="text-4xl font-bold text-indigo-600">{storiesCount}</div>
    <div class="text-gray-600">Компонентов</div>
  </div>
  <div class="stat-card">
    <div class="text-4xl font-bold text-purple-600">{categoriesCount}</div>
    <div class="text-gray-600">Категорий</div>
  </div>
  <div class="stat-card">
    <div class="text-4xl font-bold text-pink-600">100%</div>
    <div class="text-gray-600">TypeScript</div>
  </div>
</div>
```

3. **Карточки быстрого старта с примерами**
```svelte
<div class="quick-start-cards">
  <div class="card hover:shadow-xl transition-all">
    <h3>Попробуйте Button</h3>
    <Button variant="primary">Кликни меня!</Button>
    <button onclick={() => navigateToStory('atoms-button')}>
      Открыть в playground →
    </button>
  </div>
  <!-- Аналогично для Input, Select и других популярных компонентов -->
</div>
```

---

#### 2.2 Улучшение Navigator (боковая панель)
**Текущие проблемы:**
- Простой список без группировки
- Нет индикаторов состояния
- Мало визуальной информации

**Предлагаемые улучшения:**

1. **Счетчики компонентов в категориях**
```svelte
<h3 class="category-header">
  {category}
  <span class="badge">{stories.length}</span>
</h3>
```

2. **Иконки для категорий**
```svelte
const categoryIcons = {
  'Atoms': '⚛️',
  'Molecules': '🧬',
  'Organisms': '🦠',
  'Feedback': '💬'
};
```

3. **Превью компонентов при наведении**
```svelte
<div class="story-item-preview">
  <Tooltip>
    <img src={`/previews/${story.id}.png`} alt="Preview" />
  </Tooltip>
</div>
```

4. **Индикаторы новых/обновленных компонентов**
```svelte
{#if story.isNew}
  <span class="badge badge-new">NEW</span>
{/if}
{#if story.isUpdated}
  <span class="badge badge-updated">UPDATED</span>
{/if}
```

---

#### 2.3 Улучшение Canvas (область просмотра)
**Предлагаемые улучшения:**

1. **Визуальные границы viewport**
```svelte
<div class="viewport-container">
  {#if viewport !== 'desktop'}
    <div class="viewport-frame {viewport}">
      <div class="viewport-header">
        {viewportWidths[viewport]}px
      </div>
      <!-- Компонент здесь -->
    </div>
  {/if}
</div>
```

2. **Фоновые паттерны для лучшей видимости**
```svelte
<select bind:value={canvasBackground}>
  <option value="white">Белый</option>
  <option value="gray">Серый</option>
  <option value="dark">Темный</option>
  <option value="grid">Сетка</option>
  <option value="dots">Точки</option>
</select>
```

3. **Режим полноэкранного просмотра**
```svelte
<button onclick={toggleFullscreen}>
  {#if isFullscreen}
    ⛶ Выход из полноэкранного режима
  {:else}
    ⛶ Полноэкранный режим
  {/if}
</button>
```

4. **Zoom контролы**
```svelte
<div class="zoom-controls">
  <button onclick={() => zoom = Math.max(0.5, zoom - 0.1)}>-</button>
  <span>{Math.round(zoom * 100)}%</span>
  <button onclick={() => zoom = Math.min(2, zoom + 0.1)}>+</button>
  <button onclick={() => zoom = 1}>Reset</button>
</div>
```

---

#### 2.4 Улучшение ControlPanel
**Предлагаемые улучшения:**

1. **Группировка controls по типам**
```svelte
<div class="control-groups">
  <div class="control-group">
    <h4>Внешний вид</h4>
    <!-- variant, size, color -->
  </div>
  <div class="control-group">
    <h4>Состояние</h4>
    <!-- disabled, loading, error -->
  </div>
  <div class="control-group">
    <h4>Содержимое</h4>
    <!-- label, placeholder, value -->
  </div>
</div>
```

2. **Кнопка "Reset to defaults"**
```svelte
<button onclick={resetControls}>
  ↺ Сбросить все значения
</button>
```

3. **История изменений**
```svelte
<div class="control-history">
  <button onclick={undo} disabled={!canUndo}>↶ Отменить</button>
  <button onclick={redo} disabled={!canRedo}>↷ Вернуть</button>
</div>
```

4. **Предустановки (Presets)**
```svelte
<select onchange={applyPreset}>
  <option>Выберите пресет...</option>
  <option value="primary-cta">Primary CTA</option>
  <option value="danger-destructive">Danger Button</option>
  <option value="ghost-subtle">Ghost Subtle</option>
</select>
```

---

#### 2.5 Улучшение CodeViewer
**Текущие проблемы:**
- Нет подсветки синтаксиса
- Нет номеров строк
- Нельзя скопировать отдельные части

**Предлагаемые улучшения:**

1. **Синтаксическая подсветка**
```bash
npm install shiki
```

```svelte
<script>
  import { codeToHtml } from 'shiki';

  let highlightedCode = $derived(async () => {
    return await codeToHtml(generatedCode(), {
      lang: 'svelte',
      theme: darkMode ? 'github-dark' : 'github-light'
    });
  });
</script>

<div class="code-viewer">
  {@html highlightedCode()}
</div>
```

2. **Вкладки для разных форматов**
```svelte
<div class="code-tabs">
  <button class:active={codeFormat === 'svelte'}
          onclick={() => codeFormat = 'svelte'}>
    Svelte
  </button>
  <button class:active={codeFormat === 'jsx'}
          onclick={() => codeFormat = 'jsx'}>
    React (JSX)
  </button>
  <button class:active={codeFormat === 'vue'}
          onclick={() => codeFormat = 'vue'}>
    Vue
  </button>
</div>
```

3. **Экспорт в файл**
```svelte
<button onclick={downloadAsFile}>
  💾 Скачать как файл
</button>

<script>
  function downloadAsFile() {
    const blob = new Blob([generatedCode()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStory.id}.svelte`;
    a.click();
  }
</script>
```

4. **Режим сравнения (Diff Mode)**
```svelte
<button onclick={toggleDiffMode}>
  {diffMode ? '📄 Обычный режим' : '⚖️ Режим сравнения'}
</button>

{#if diffMode}
  <div class="diff-viewer">
    <div class="diff-column">
      <h4>Базовый код</h4>
      <pre>{baseCode}</pre>
    </div>
    <div class="diff-column">
      <h4>Ваши изменения</h4>
      <pre>{modifiedCode}</pre>
    </div>
  </div>
{/if}
```

---

#### 2.6 Улучшение Toolbar
**Текущий функционал:** Toggle sidebar, dark mode, viewport, code

**Предлагаемые дополнения:**

1. **Breadcrumbs (хлебные крошки)**
```svelte
<div class="breadcrumbs">
  <span>Home</span> /
  <span>{currentStory?.category}</span> /
  <strong>{currentStory?.title}</strong>
</div>
```

2. **Кнопка "Поделиться"**
```svelte
<button onclick={shareStory}>
  🔗 Поделиться
</button>

<script>
  async function shareStory() {
    const url = `${location.origin}?story=${currentStoryId}`;
    await navigator.clipboard.writeText(url);
    // Показать toast уведомление
  }
</script>
```

3. **Быстрые действия**
```svelte
<div class="quick-actions">
  <button onclick={randomizeProps} title="Случайные значения">
    🎲
  </button>
  <button onclick={toggleAnimations} title="Анимации">
    {animationsEnabled ? '▶️' : '⏸️'}
  </button>
  <button onclick={takeScreenshot} title="Скриншот">
    📸
  </button>
</div>
```

4. **История навигации**
```svelte
<div class="navigation-history">
  <button onclick={goBack} disabled={!canGoBack}>
    ← Назад
  </button>
  <button onclick={goForward} disabled={!canGoForward}>
    Вперед →
  </button>
</div>
```

---

### Фаза 3: Новые функции (Приоритет: НИЗКИЙ)

#### 3.1 Система комментариев
```svelte
<div class="comments-panel">
  <h3>Комментарии ({commentsCount})</h3>
  <div class="comment-list">
    {#each comments as comment}
      <div class="comment">
        <div class="comment-author">{comment.author}</div>
        <div class="comment-text">{comment.text}</div>
        <div class="comment-time">{comment.timestamp}</div>
      </div>
    {/each}
  </div>
  <form onsubmit={addComment}>
    <textarea placeholder="Добавить комментарий..."></textarea>
    <button type="submit">Отправить</button>
  </form>
</div>
```

#### 3.2 A/B тестирование
```svelte
<div class="ab-testing">
  <h3>Сравнение вариантов</h3>
  <div class="variant-selector">
    <label>
      <input type="checkbox" bind:checked={variantA.enabled} />
      Вариант A
    </label>
    <label>
      <input type="checkbox" bind:checked={variantB.enabled} />
      Вариант B
    </label>
  </div>
  <div class="comparison-view">
    {#if variantA.enabled}
      <div class="variant">
        <h4>Вариант A</h4>
        <!-- Компонент с пропами A -->
      </div>
    {/if}
    {#if variantB.enabled}
      <div class="variant">
        <h4>Вариант B</h4>
        <!-- Компонент с пропами B -->
      </div>
    {/if}
  </div>
</div>
```

#### 3.3 Accessibility проверки
```svelte
<div class="a11y-panel">
  <h3>Доступность</h3>
  <div class="a11y-checks">
    <div class="check" class:pass={checks.contrast}>
      {checks.contrast ? '✓' : '✗'} Контрастность
    </div>
    <div class="check" class:pass={checks.keyboard}>
      {checks.keyboard ? '✓' : '✗'} Навигация с клавиатуры
    </div>
    <div class="check" class:pass={checks.aria}>
      {checks.aria ? '✓' : '✗'} ARIA атрибуты
    </div>
    <div class="check" class:pass={checks.screenReader}>
      {checks.screenReader ? '✓' : '✗'} Скрин ридеры
    </div>
  </div>
  <button onclick={runA11yAudit}>
    Запустить полный аудит
  </button>
</div>
```

#### 3.4 Интеграция с дизайн системой
```svelte
<div class="design-tokens">
  <h3>Design Tokens</h3>
  <div class="token-list">
    <div class="token">
      <div class="token-name">--color-primary</div>
      <div class="token-value">#6366f1</div>
      <div class="token-swatch" style="background: #6366f1"></div>
    </div>
    <!-- Другие токены -->
  </div>
</div>
```

---

## Приоритизация задач

### Неделя 1 (Критические проблемы)
- [ ] 1.1 Интеграция stories через import.meta.glob
- [ ] 1.2 Удаление дублирующих маршрутов
- [ ] Тестирование базового функционала

### Неделя 2 (Основные улучшения UI)
- [ ] 2.1 Редизайн главной страницы
- [ ] 2.2 Улучшение Navigator
- [ ] 2.3 Улучшение Canvas

### Неделя 3 (Панели управления)
- [ ] 2.4 Улучшение ControlPanel
- [ ] 2.5 Улучшение CodeViewer
- [ ] 2.6 Улучшение Toolbar

### Неделя 4 (Дополнительные функции)
- [ ] 3.1 Система комментариев
- [ ] 3.2 A/B тестирование
- [ ] 3.3 Accessibility проверки
- [ ] 3.4 Design tokens

---

## Метрики успеха

1. **Функциональность**
   - ✓ Все 14 stories загружаются
   - ✓ Нет сообщений "No stories found"
   - ✓ Controls работают корректно

2. **UX**
   - Время до первого взаимодействия < 3 сек
   - 0 confusion points в навигации
   - Интуитивно понятный интерфейс

3. **Визуал**
   - Современный дизайн
   - Плавные анимации
   - Responsive на всех устройствах

4. **Производительность**
   - Загрузка < 2 сек
   - 60 FPS анимации
   - Lighthouse score > 90