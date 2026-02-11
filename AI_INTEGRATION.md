# AI Integration в Stylist Playground

Интеграция AI-моделей (Gemini, Qwen, Claude, Codex) в Stylist Playground.

## Архитектура

### Компоненты

1. **AIClient** (`src/lib/api/aiClient.ts`)
   - Унифицированный клиент для работы с AI серверами
   - Поддерживает Gemini и Qwen (Claude и Codex - планируются)
   - Методы: `chat()`, `readFile()`, `shell()`, `getTools()`

2. **AIPanel** (`src/lib/components/playground/AIPanel.svelte`)
   - Левая панель выбора AI-провайдера
   - Навигация по опциям (новый чат, версия, настройки)

3. **AIAssistant** (`src/lib/components/playground/AIAssistant.svelte`)
   - Правая панель чата с AI
   - Поддержка streaming ответов
   - История сообщений
   - Обработка ошибок

## Установка и настройка

### 1. Запуск Gemini Server

```bash
cd packages/gemini-cli
npm run start --workspace @google/gemini-cli-server
```

Сервер запустится на `http://127.0.0.1:41241`

### 2. Запуск Qwen Server

```bash
cd packages/qwen-code
npm run start --workspace @qwen-code/qwen-code-server
```

Сервер запустится на `http://127.0.0.1:41242`

### 3. Конфигурация API клиента

Отредактируйте `src/lib/api/aiClient.ts` для настройки базовых URL и workspace:

```typescript
const configs: Record<AIServerConfig['providerId'], Partial<AIServerConfig>> = {
  gemini: {
    baseUrl: 'http://127.0.0.1:41241',
    workspace: 'D:/2025/dev', // Ваш workspace
  },
  qwen: {
    baseUrl: 'http://127.0.0.1:41242',
    workspace: 'D:/2025/dev',
  },
  // ...
};
```

### 4. CORS

CORS уже настроен в обоих серверах (`cors` установлен и подключен).

**Для production**: замените `origin: '*'` на конкретные домены:

```typescript
app.use(cors({
  origin: ['https://your-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Использование

### 1. Открытие AI Panel

Нажмите кнопку **AI** (со звездочкой) в хедере playground.

### 2. Выбор провайдера

В левой панели раскройте провайдера (CLAUDE, CODEX, GEMINI, QWEN).

### 3. Запуск чата

Нажмите **"Новый чат"** - откроется правая панель с AI Assistant.

### 4. Общение с AI

Введите сообщение и нажмите Enter или кнопку отправки.

## API Reference

### AIClient

```typescript
import { createAIClient } from '$lib/api/aiClient';

const client = createAIClient('gemini');

// Отправка сообщения
const response = await client.chat({
  prompt: 'Привет! Как дела?',
  autoApproveTools: true,
});

// Чтение файла из workspace
const file = await client.readFile({
  path: 'README.md',
  maxBytes: 10000,
});

// Выполнение shell команды
const result = await client.shell({
  command: 'git status',
});

// Получение списка доступных инструментов
const tools = await client.getTools();
```

### Типы данных

```typescript
interface ChatRequest {
  prompt: string;
  sessionId?: string;
  autoApproveTools?: boolean;
  stream?: boolean;
  contextFiles?: Array<{
    path?: string;
    content?: string;
    alias?: string;
  }>;
}

interface ChatResponse {
  sessionId: string;
  text: string;
  finishReason?: string;
  model: string;
}
```

## Расширение

### Добавление нового провайдера

1. Запустите новый AI сервер на другом порту
2. Добавьте конфиг в `aiClient.ts`:

```typescript
const configs: Record<AIServerConfig['providerId'], Partial<AIServerConfig>> = {
  // ...
  myai: {
    baseUrl: 'http://127.0.0.1:41245',
    workspace: 'D:/2025/dev',
  },
};
```

3. Добавьте провайдера в `AIPanel.svelte`:

```typescript
const aiProviders: AIProvider[] = [
  // ...
  {
    id: 'myai',
    name: 'MY AI',
    options: [
      { id: 'new-chat', label: 'Новый чат' },
      { id: 'version', label: 'Версия' },
      { id: 'settings', label: 'Настройки' }
    ]
  }
];
```

4. Обновите тип `providerId`:

```typescript
type ProviderId = 'gemini' | 'qwen' | 'claude' | 'codex' | 'myai';
```

## Troubleshooting

### Ошибка CORS

Убедитесь, что CORS настроен на серверах и они запущены.

### Сервер не отвечает

Проверьте, что серверы запущены:

```bash
# Проверка Gemini
curl http://127.0.0.1:41241/healthz

# Проверка Qwen
curl http://127.0.0.1:41242/healthz
```

### Ошибка workspace

Убедитесь, что путь `workspace` в конфиге существует и доступен серверу.

## Roadmap

- [ ] Добавить поддержку Claude
- [ ] Добавить поддержку Codex
- [ ] Streaming ответов (SSE)
- [ ] История чатов (сохранение в localStorage)
- [ ] Настройки провайдера (модель, температура и т.д.)
- [ ] Прикрепление файлов к сообщениям
- [ ] Markdown рендеринг в сообщениях
- [ ] Code highlighting в сообщениях

## Безопасность

⚠️ **ВАЖНО**: Текущая конфигурация CORS (`origin: '*'`) предназначена только для разработки.

Для production:
1. Ограничьте `origin` конкретными доменами
2. Добавьте аутентификацию (API ключи, OAuth)
3. Используйте HTTPS
4. Настройте rate limiting
5. Валидируйте все входные данные

## Лицензия

MIT
