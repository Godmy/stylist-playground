<script lang="ts">
  import { createAIClient } from '../../lib/api/aiClient';

  let result = $state('');
  let error = $state('');
  let loading = $state(false);

  async function testGemini() {
    result = '';
    error = '';
    loading = true;

    try {
      const client = createAIClient('gemini');

      // Test healthz first
      const healthResponse = await fetch('http://127.0.0.1:41241/healthz');
      const health = await healthResponse.json();
      result += `Health check: ${JSON.stringify(health)}\n\n`;

      // Test chat
      const chatResponse = await client.chat({
        prompt: 'Привет!',
        autoApproveTools: true,
      });

      result += `Chat response:\n${JSON.stringify(chatResponse, null, 2)}`;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      console.error('Test error:', err);
    } finally {
      loading = false;
    }
  }

  async function testDirectFetch() {
    result = '';
    error = '';
    loading = true;

    try {
      const response = await fetch('http://127.0.0.1:41241/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspace: 'D:/2025/dev',
          prompt: 'Привет!',
          autoApproveTools: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      result = `Direct fetch successful:\n${JSON.stringify(data, null, 2)}`;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      console.error('Direct fetch error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-6">AI Integration Test</h1>

  <div class="space-y-4">
    <div class="flex gap-4">
      <button
        onclick={testGemini}
        disabled={loading}
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test via AIClient'}
      </button>

      <button
        onclick={testDirectFetch}
        disabled={loading}
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Direct Fetch'}
      </button>
    </div>

    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    {/if}

    {#if result}
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <pre class="whitespace-pre-wrap font-mono text-sm">{result}</pre>
      </div>
    {/if}

    <div class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
      <h2 class="text-xl font-bold mb-4">Debug Info</h2>
      <ul class="space-y-2 text-sm">
        <li><strong>Gemini Server:</strong> http://127.0.0.1:41241</li>
        <li><strong>Workspace:</strong> D:/2025/dev</li>
        <li><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</li>
      </ul>
    </div>

    <div class="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 class="font-bold mb-2">Manual Tests</h3>
      <p class="text-sm mb-2">Open browser console and run:</p>
      <pre class="bg-white p-2 rounded text-xs overflow-x-auto">
fetch('http://127.0.0.1:41241/healthz')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
      </pre>
    </div>
  </div>
</div>

<style>
  :global(body) {
    background: #f5f5f5;
  }
</style>
