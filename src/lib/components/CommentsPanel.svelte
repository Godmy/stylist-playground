<script lang="ts">
  // Типы для комментариев
  type Comment = {
    id: string;
    author: string;
    text: string;
    timestamp: Date;
    avatar?: string;
  };
  
  // Параметры компонента с использованием $props()
  const { 
    storyId = '', 
    componentName = '' 
  } = $props<{ 
    storyId?: string; 
    componentName?: string; 
  }>();
  
  // Состояния
  let comments = $state<Comment[]>([
    {
      id: '1',
      author: 'Алексей Петров',
      text: 'Отличный компонент! Использую его в своем проекте.',
      timestamp: new Date(Date.now() - 3600000), // 1 час назад
      avatar: 'https://i.pravatar.cc/40?img=1'
    },
    {
      id: '2',
      author: 'Мария Сидорова',
      text: 'Можно ли добавить поддержку темной темы?',
      timestamp: new Date(Date.now() - 1800000), // 30 минут назад
      avatar: 'https://i.pravatar.cc/40?img=2'
    }
  ]);
  
  let newComment = $state('');
  let commentsCount = $derived(comments.length);
  
  // Добавление нового комментария
  const addComment = (e: Event) => {
    e.preventDefault();
    
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Вы',
        text: newComment.trim(),
        timestamp: new Date(),
        avatar: 'https://i.pravatar.cc/40?img=3'
      };
      
      comments = [comment, ...comments];
      newComment = '';
    }
  };
  
  // Форматирование времени
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} ч. назад`;
    return date.toLocaleDateString();
  };
</script>

<div class="comments-panel border-t border-gray-200 dark:border-gray-700 pt-4">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Комментарии ({commentsCount})</h3>
  </div>
  
  <!-- Форма добавления комментария -->
  <form onsubmit={addComment} class="mb-6">
    <div class="flex space-x-3">
      <div class="flex-shrink-0">
        <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <span class="text-gray-700 dark:text-gray-300">В</span>
        </div>
      </div>
      <div class="flex-1">
        <textarea
          bind:value={newComment}
          placeholder="Добавить комментарий..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
          rows="3"
        ></textarea>
        <div class="mt-2 flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={!newComment.trim()}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  </form>
  
  <!-- Список комментариев -->
  <div class="comment-list space-y-4">
    {#each comments as comment (comment.id)}
      <div class="comment bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div class="flex space-x-3">
          <div class="flex-shrink-0">
            {#if comment.avatar}
              <img 
                src={comment.avatar} 
                alt={comment.author} 
                class="w-10 h-10 rounded-full object-cover"
              />
            {:else}
              <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span class="text-gray-700 dark:text-gray-300">{comment.author.charAt(0)}</span>
              </div>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between">
              <h4 class="text-sm font-medium text-gray-800 dark:text-white truncate">{comment.author}</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{formatTime(comment.timestamp)}</span>
            </div>
            <div class="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {comment.text}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>