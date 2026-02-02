<script lang="ts">
  import { X, Send, Trash2, RotateCcw, Loader2 } from 'lucide-svelte';
  import { createAIClient, type ChatMessage } from '../../api/aiClient';
  import { onMount } from 'svelte';

  interface Props {
    providerId?: 'gemini' | 'qwen' | 'claude' | 'codex';
    onClose?: () => void;
  }

  let { providerId = 'gemini', onClose }: Props = $props();

  // State
  let inputMessage = $state('');
  let messages = $state<ChatMessage[]>([]);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let messagesContainer: HTMLDivElement;

  // Create AI client
  let aiClient = $derived(createAIClient(providerId));

  // Provider names mapping
  const providerNames: Record<typeof providerId, string> = {
    gemini: 'Gemini',
    qwen: 'Qwen',
    claude: 'Claude',
    codex: 'Codex',
  };

  // Send message to AI
  async function sendMessage() {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now(),
    };

    messages.push(userMessage);
    const userPrompt = inputMessage;
    inputMessage = '';
    isLoading = true;
    error = null;

    // Scroll to bottom
    setTimeout(scrollToBottom, 100);

    try {
      const response = await aiClient.chat({
        prompt: userPrompt,
        autoApproveTools: true,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text || '(empty response)',
        timestamp: Date.now(),
      };

      messages.push(assistantMessage);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('AI chat error:', err);

      // Detailed error message
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        const sessionId = typeof aiClient.getSessionId === 'function' ? aiClient.getSessionId() : undefined;
        error = `Cannot connect to ${providerNames[providerId]} server. Please check:\n1. Server is running\n2. URL is correct: ${sessionId ? 'configured' : 'not configured'}\n3. CORS is enabled`;
      } else {
        error = err instanceof Error ? err.message : 'Failed to get response from AI';
      }
    } finally {
      isLoading = false;
    }
  }

  // Handle keyboard shortcuts
  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Clear chat history
  function clearChat() {
    messages = [];
    aiClient.resetSession();
    error = null;
  }

  // Scroll to bottom of messages
  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Add initial greeting
  onMount(() => {
    messages = [
      {
        role: 'assistant',
        content: `Здравствуйте! Я ${providerNames[providerId]} AI Assistant. Чем могу помочь?`,
        timestamp: Date.now(),
      },
    ];
  });
</script>

<style>
  .chat-assistant {
    position: fixed;
    top: 3.5rem;
    right: 0;
    bottom: 0;
    width: 450px;
    max-width: 90vw;
    background: white;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    z-index: 9998;
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.3s ease-out;
  }

  :global(.dark) .chat-assistant {
    background: #1f2937;
    border-left-color: rgba(255, 255, 255, 0.1);
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .message {
    padding: 0.875rem 1rem;
    border-radius: 0.875rem;
    max-width: 85%;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .message.user {
    align-self: flex-end;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  .message.assistant {
    align-self: flex-start;
    background: #f3f4f6;
    color: #1f2937;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .message.assistant {
    background: #374151;
    color: #f9fafb;
  }

  .input-container {
    padding: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    background: white;
  }

  :global(.dark) .input-container {
    border-top-color: rgba(255, 255, 255, 0.1);
    background: #1f2937;
  }

  .error-banner {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.75rem 1rem;
    border-left: 4px solid #dc2626;
    margin: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  :global(.dark) .error-banner {
    background: #7f1d1d;
    color: #fecaca;
    border-left-color: #ef4444;
  }

  .loading-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f3f4f6;
    border-radius: 0.875rem;
    max-width: 85%;
    align-self: flex-start;
    color: #6b7280;
    font-size: 0.875rem;
  }

  :global(.dark) .loading-indicator {
    background: #374151;
    color: #9ca3af;
  }
</style>

<div class="chat-assistant">
  <!-- Header -->
  <div
    class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"
  >
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {providerNames[providerId]} AI
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {#if aiClient.getSessionId()}
            Session: {aiClient.getSessionId()?.substring(0, 8)}...
          {:else}
            New session
          {/if}
        </p>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <button
        onclick={clearChat}
        class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Clear chat"
      >
        <Trash2 class="w-4 h-4" />
      </button>
      <button
        onclick={onClose}
        class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Close"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>

  <!-- Error banner -->
  {#if error}
    <div class="error-banner">
      <strong>Error:</strong>
      {error}
    </div>
  {/if}

  <!-- Messages -->
  <div bind:this={messagesContainer} class="messages-container">
    {#each messages as message}
      <div class="message {message.role}">
        {message.content}
      </div>
    {/each}

    {#if isLoading}
      <div class="loading-indicator">
        <Loader2 class="w-4 h-4 animate-spin" />
        <span>{providerNames[providerId]} is thinking...</span>
      </div>
    {/if}
  </div>

  <!-- Input -->
  <div class="input-container">
    <div class="flex gap-2">
      <textarea
        bind:value={inputMessage}
        onkeypress={handleKeyPress}
        placeholder="Введите сообщение..."
        rows="2"
        disabled={isLoading}
        class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none disabled:opacity-50"
      ></textarea>
      <button
        onclick={sendMessage}
        disabled={!inputMessage.trim() || isLoading}
        class="p-2 h-10 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
      >
        {#if isLoading}
          <Loader2 class="w-5 h-5 animate-spin" />
        {:else}
          <Send class="w-5 h-5" />
        {/if}
      </button>
    </div>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
      Press Enter to send, Shift+Enter for new line
    </p>
  </div>
</div>
