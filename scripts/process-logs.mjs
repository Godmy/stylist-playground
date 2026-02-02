#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Log } from '@kitql/helpers';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Получаем директорию с логами
const logsDir = path.resolve(__dirname, '../logs/dev-errors');

// Конфигурация для отправки ошибок на бэкенд
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/graphql';
const ERROR_REPORT_INTERVAL = process.env.ERROR_REPORT_INTERVAL || 30000; // 30 секунд

// Кэш для отслеживания уже отправленных ошибок
const sentErrorsCache = new Map();

function analyzeLogFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Разбиваем лог на записи
  const entries = content.split('\n---\n').filter(entry => entry.trim() !== '');

  const errors = [];
  const warnings = [];

  for (const entry of entries) {
    if (entry.includes('message') && entry.includes('stack')) {
      // Извлекаем информацию об ошибке
      const messageMatch = entry.match(/\[([^\]]+)\] message \| sha256=[a-f0-9]+\n([^]+)/);
      const stackMatch = entry.match(/stack \| sha256=[a-f0-9]+\n([\s\S]*?)(?=\n\[|$)/);

      if (messageMatch) {
        const timestamp = messageMatch[1];
        const message = messageMatch[2];

        let stack = '';
        if (stackMatch) {
          stack = stackMatch[1].trim();
        }

        errors.push({
          timestamp,
          message,
          stack,
          filePath: path.relative(logsDir, filePath)
        });
      }
    }
  }

  return { errors, warnings };
}

async function sendErrorToBackend(error) {
  // Создаем уникальный идентификатор ошибки для предотвращения дубликатов
  const errorId = `${error.filePath}-${error.message.substring(0, 50)}-${error.timestamp}`;

  // Проверяем, не отправляли ли мы уже эту ошибку недавно
  if (sentErrorsCache.has(errorId)) {
    const lastSent = sentErrorsCache.get(errorId);
    if (Date.now() - lastSent < ERROR_REPORT_INTERVAL) {
      return; // Пропускаем, если ошибка была отправлена недавно
    }
  }

  try {
    // Подготовка данных для отправки
    const errorData = {
      type: 'COMPONENT_ERROR',
      level: 'ERROR',
      componentPath: error.filePath,
      message: error.message,
      stackTrace: error.stack,
      timestamp: error.timestamp,
      source: 'stylist-playground',
      metadata: {
        userAgent: 'stylist-playground-agent',
        version: '0.1.0'
      }
    };

    // GraphQL mutation для отправки ошибки
    const mutation = `
      mutation ReportError($error: ErrorInput!) {
        reportError(error: $error) {
          id
          success
          message
        }
      }
    `;

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          error: errorData
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      Log.red(`❌ Ошибка при отправке в GraphQL: ${JSON.stringify(result.errors)}`);
    } else {
      Log.green(`✅ Ошибка успешно отправлена в бэкенд: ${result.data.reportError.id}`);
      // Сохраняем время отправки в кэш
      sentErrorsCache.set(errorId, Date.now());
    }
  } catch (err) {
    Log.red(`❌ Ошибка при отправке в бэкенд: ${err.message}`);
  }
}

async function processLogDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Рекурсивно обрабатываем поддиректории
      await processLogDirectory(fullPath);
    } else if (item.endsWith('.log')) {
      // Обрабатываем лог-файл
      Log.blue(`\n🔍 Обработка файла: ${fullPath}`);

      try {
        const { errors, warnings } = analyzeLogFile(fullPath);

        if (errors.length > 0) {
          Log.red(`❌ Найдено ${errors.length} ошибок:`);
          for (let i = 0; i < Math.min(errors.length, 5); i++) { // Показываем только первые 5 ошибок
            const error = errors[i];
            Log.yellow(`  • ${error.message.substring(0, 100)}${error.message.length > 100 ? '...' : ''}`);
            if (error.stack && error.stack !== '(no stack provided)') {
              Log.gray(`    Stack: ${error.stack.substring(0, 200)}${error.stack.length > 200 ? '...' : ''}`);
            }

            // Отправляем ошибку на бэкенд
            await sendErrorToBackend(error);
          }

          if (errors.length > 5) {
            Log.gray(`    ... и ещё ${errors.length - 5} ошибок`);

            // Отправляем оставшиеся ошибки
            for (let i = 5; i < errors.length; i++) {
              await sendErrorToBackend(errors[i]);
            }
          }
        } else {
          Log.green('✅ Ошибок не найдено');
        }

        if (warnings.length > 0) {
          Log.magenta(`⚠️  Найдено ${warnings.length} предупреждений`);
        }
      } catch (err) {
        Log.red(`❌ Ошибка при обработке файла ${fullPath}: ${err.message}`);
      }
    }
  }
}

async function monitorSessionLogs() {
  const sessionPattern = /^session-(.+)\.log$/;
  const items = fs.readdirSync(logsDir);

  for (const item of items) {
    if (sessionPattern.test(item)) {
      const fullPath = path.join(logsDir, item);
      const stat = fs.statSync(fullPath);

      // Проверяем, был ли файл изменен за последние 10 минут
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      if (stat.mtime > tenMinutesAgo) {
        Log.cyan(`\n🕒 Обнаружена активная сессия: ${item}`);

        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');

          // Показываем последние 10 строк лога сессии
          const recentLines = lines.slice(-10).filter(line => line.trim() !== '');
          if (recentLines.length > 0) {
            Log.gray('Последние записи:');
            recentLines.forEach(line => {
              if (line.includes('error') || line.includes('Error')) {
                Log.red(`  ${line}`);
              } else {
                Log.gray(`  ${line}`);
              }
            });
          }
        } catch (err) {
          Log.red(`❌ Ошибка при чтении файла сессии ${fullPath}: ${err.message}`);
        }
      }
    }
  }
}

// Основная функция
async function main() {
  Log.bold('🔬 Анализ логов Stylist Playground');
  Log.gray('=====================================');

  if (!fs.existsSync(logsDir)) {
    Log.yellow('📁 Директория с логами не найдена, создаем...');
    fs.mkdirSync(logsDir, { recursive: true });
    return;
  }

  Log.cyan(`📊 Обработка логов из: ${logsDir}`);
  Log.cyan(`📡 Отправка ошибок на бэкенд: ${BACKEND_URL}`);

  // Сначала обрабатываем основную директорию
  await processLogDirectory(logsDir);

  // Затем проверяем сессии
  await monitorSessionLogs();

  Log.bold('\n✅ Обработка завершена');
}

// Запускаем анализ
main().catch(err => {
  Log.red(`❌ Критическая ошибка: ${err.message}`);
  process.exit(1);
});