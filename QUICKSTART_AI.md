# AI Integration - Быстрый старт

## Шаг 1: Запуск AI серверов

### Gemini Server
```bash
cd D:\2025\dev\packages\gemini-cli
npm run start --workspace @google/gemini-cli-server
```
Ожидаемый вывод:
```
[GeminiServer] Listening on http://127.0.0.1:41241
```

### Qwen Server
```bash
cd D:\2025\dev\packages\qwen-code
npm run start --workspace @qwen-code/qwen-code-server
```
Ожидаемый вывод:
```
[QwenServer] Listening on http://127.0.0.1:41242
```

## Шаг 2: Запуск Stylist Playground

```bash
cd D:\2025\dev\packages\stylist-playground
npm run dev
```

Откройте: `http://localhost:5173/playground`

## Шаг 3: Использование

1. **Откройте AI панель**
   - Нажмите кнопку с иконкой ⭐ **AI** в хедере

2. **Выберите провайдера**
   - В левой панели разверните GEMINI или QWEN

3. **Запустите чат**
   - Нажмите **"Новый чат"**
   - Справа откроется окно чата

4. **Общайтесь с AI**
   - Введите сообщение
   - Нажмите Enter или кнопку отправки

## Проверка работоспособности

### Тест Gemini Server
```bash
curl http://127.0.0.1:41241/healthz
# Ожидается: {"status":"ok"}
```

### Тест Qwen Server
```bash
curl http://127.0.0.1:41242/healthz
# Ожидается: {"status":"ok"}
```

### Тест чата через curl
```bash
curl -X POST http://127.0.0.1:41241/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "workspace": "D:/2025/dev",
    "prompt": "Привет!",
    "autoApproveTools": true
  }'
```

## Что делать, если не работает?

### CORS ошибка
- Убедитесь, что серверы запущены
- Проверьте, что в браузере нет блокировки CORS

### Сервер не отвечает
- Проверьте, что порты 41241 и 41242 свободны
- Перезапустите серверы

### Ошибка workspace
- Убедитесь, что путь `D:/2025/dev` существует
- Измените workspace в `src/lib/api/aiClient.ts`

## Следующие шаги

Полная документация: [AI_INTEGRATION.md](./AI_INTEGRATION.md)

## Структура файлов

```
packages/stylist-playground/
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   └── aiClient.ts          # API клиент
│   │   └── components/
│   │       └── playground/
│   │           ├── AIPanel.svelte    # Панель выбора AI
│   │           └── AIAssistant.svelte # Окно чата
│   └── routes/
│       └── playground/
│           └── +page.svelte          # Главная страница
├── AI_INTEGRATION.md                 # Полная документация
└── QUICKSTART_AI.md                  # Этот файл
```

## Скриншоты

См. `packages/stylist-playground/static/screenshots/` для примеров интерфейса.
