<script lang="ts">
  import { marked } from 'marked';
  import { onMount } from 'svelte';

  type Props = {
    content: string;
    class?: string;
  };

  let { content, class: hostClass = '' }: Props = $props();

  let html = $state('');

  // Configure marked for safe rendering
  marked.setOptions({
    gfm: true,
    breaks: true
  });

  $effect(() => {
    try {
      html = marked.parse(content) as string;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      html = `<p class="text-red-600">Error rendering markdown</p>`;
    }
  });
</script>

<div
  class={`markdown-content prose prose-sm max-w-none dark:prose-invert ${hostClass}`}
>
  {@html html}
</div>

<style>
  :global(.markdown-content) {
    color: inherit;
  }

  :global(.markdown-content h1) {
    font-size: 1.875rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: inherit;
  }

  :global(.markdown-content h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: inherit;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 0.5rem;
  }

  :global(.markdown-content h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    color: inherit;
  }

  :global(.markdown-content p) {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    line-height: 1.625;
    color: inherit;
  }

  :global(.markdown-content ul),
  :global(.markdown-content ol) {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
    color: inherit;
  }

  :global(.markdown-content li) {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    color: inherit;
  }

  :global(.markdown-content code) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  :global(.dark .markdown-content code) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  :global(.markdown-content pre) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  :global(.dark .markdown-content pre) {
    background-color: rgba(255, 255, 255, 0.05);
  }

  :global(.markdown-content pre code) {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
  }

  :global(.markdown-content blockquote) {
    border-left: 4px solid rgba(0, 0, 0, 0.2);
    padding-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: rgba(0, 0, 0, 0.7);
  }

  :global(.dark .markdown-content blockquote) {
    border-left-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.7);
  }

  :global(.markdown-content a) {
    color: #3b82f6;
    text-decoration: underline;
  }

  :global(.markdown-content a:hover) {
    color: #2563eb;
  }

  :global(.dark .markdown-content a) {
    color: #60a5fa;
  }

  :global(.dark .markdown-content a:hover) {
    color: #93c5fd;
  }

  :global(.markdown-content table) {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  :global(.markdown-content th),
  :global(.markdown-content td) {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    text-align: left;
  }

  :global(.dark .markdown-content th),
  :global(.dark .markdown-content td) {
    border-color: rgba(255, 255, 255, 0.1);
  }

  :global(.markdown-content th) {
    background-color: rgba(0, 0, 0, 0.05);
    font-weight: 600;
  }

  :global(.dark .markdown-content th) {
    background-color: rgba(255, 255, 255, 0.05);
  }

  :global(.markdown-content hr) {
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  :global(.dark .markdown-content hr) {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
</style>
