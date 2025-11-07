<script lang="ts">
  // Параметры компонента с использованием $props()
  const { componentName = '', componentRef = undefined } = $props<{ 
    componentName?: string; 
    componentRef?: HTMLElement;
  }>();
  
  // Состояния проверок
  let checks = $state({
    contrast: false,
    keyboard: false,
    aria: false,
    screenReader: false
  });
  
  let auditRunning = $state(false);
  let lastAuditTime = $state<Date | null>(null);
  
  // Запуск проверки доступности
  const runA11yAudit = async () => {
    auditRunning = true;
    
    // Симуляция асинхронной проверки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // В реальном приложении здесь будет полная проверка
    // Для демонстрации установим случайные результаты
    checks = {
      contrast: Math.random() > 0.3, // 70% шанс пройти проверку
      keyboard: Math.random() > 0.2, // 80% шанс пройти проверку
      aria: Math.random() > 0.4,     // 60% шанс пройти проверку
      screenReader: Math.random() > 0.35 // 65% шанс пройти проверку
    };
    
    lastAuditTime = new Date();
    auditRunning = false;
  };
  
  // Форматирование времени
  const formatTime = (date: Date | null) => {
    if (!date) return 'никогда';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} ч. назад`;
    return date.toLocaleDateString();
  };
</script>

<div class="a11y-panel border-t border-gray-200 dark:border-gray-700 pt-4">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Доступность (A11y)</h3>
    <span class="text-xs text-gray-500 dark:text-gray-400">Последняя проверка: {formatTime(lastAuditTime)}</span>
  </div>
  
  <div class="a11y-checks grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <div class="check bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">{checks.contrast ? '✓' : '✗'}</div>
      <div class="text-sm text-gray-700 dark:text-gray-300">Контрастность</div>
      <div class="text-xs {checks.contrast ? 'text-green-600' : 'text-red-600'}">
        {checks.contrast ? 'Пройдено' : 'Требует улучшения'}
      </div>
    </div>
    <div class="check bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">{checks.keyboard ? '✓' : '✗'}</div>
      <div class="text-sm text-gray-700 dark:text-gray-300">Навигация с клавиатуры</div>
      <div class="text-xs {checks.keyboard ? 'text-green-600' : 'text-red-600'}">
        {checks.keyboard ? 'Пройдено' : 'Требует улучшения'}
      </div>
    </div>
    <div class="check bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">{checks.aria ? '✓' : '✗'}</div>
      <div class="text-sm text-gray-700 dark:text-gray-300">ARIA атрибуты</div>
      <div class="text-xs {checks.aria ? 'text-green-600' : 'text-red-600'}">
        {checks.aria ? 'Пройдено' : 'Требует улучшения'}
      </div>
    </div>
    <div class="check bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">{checks.screenReader ? '✓' : '✗'}</div>
      <div class="text-sm text-gray-700 dark:text-gray-300">Скринридеры</div>
      <div class="text-xs {checks.screenReader ? 'text-green-600' : 'text-red-600'}">
        {checks.screenReader ? 'Пройдено' : 'Требует улучшения'}
      </div>
    </div>
  </div>
  
  <div class="flex justify-center">
    <button
      onclick={runA11yAudit}
      disabled={auditRunning}
      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
    >
      {#if auditRunning}
        <span class="animate-spin mr-2">⏳</span> Запуск проверки...
      {:else}
        Запустить полный аудит
      {/if}
    </button>
  </div>
  
  <!-- Рекомендации по улучшению доступности -->
  <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
    <h4 class="font-medium mb-1">Рекомендации:</h4>
    <ul class="list-disc pl-5 space-y-1">
      {#if !checks.contrast}
        <li>Увеличьте контраст между текстом и фоном (мин. 4.5:1 для обычного текста)</li>
      {/if}
      {#if !checks.keyboard}
        <li>Обеспечьте возможность навигации с клавиатуры и видимую индикацию фокуса</li>
      {/if}
      {#if !checks.aria}
        <li>Добавьте подходящие ARIA-атрибуты для улучшения доступности</li>
      {/if}
      {#if !checks.screenReader}
        <li>Проверьте читаемость компонента скринридерами</li>
      {/if}
      {#if checks.contrast && checks.keyboard && checks.aria && checks.screenReader}
        <li>Все проверки пройдены! Компонент соответствует базовым требованиям доступности.</li>
      {/if}
    </ul>
  </div>
</div>