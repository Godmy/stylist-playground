import { codeToHtml } from 'shiki/bundle/web';

// Ensure Shiki is properly initialized
let isInitialized = false;

/**
 * Initialize Shiki for syntax highlighting
 */
async function ensureShikiInitialized(): Promise<void> {
  if (isInitialized) return;
  
  // Shiki web bundle is self-contained, no additional initialization needed
  isInitialized = true;
}

/**
 * Syntax highlighter utility for the Playground
 */
export class SyntaxHighlighter {
  /**
   * Highlight code with the specified language
   * @param code The code to highlight
   * @param lang The language identifier (e.g., 'svelte', 'typescript', 'javascript')
   * @param theme The theme to use ('github-dark' or 'github-light')
   * @returns HTML string with syntax highlighting
   */
  static async highlight(
    code: string,
    lang: string = 'svelte',
    theme: string = 'github-dark'
  ): Promise<string> {
    try {
      await ensureShikiInitialized();
      return await codeToHtml(code, {
        lang,
        theme
      });
    } catch (error) {
      console.error('Syntax highlighting failed:', error);
      // Fallback to returning the plain code
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
  }

  /**
   * Get HTML for code with line numbers
   * @param code The code to highlight
   * @param lang The language identifier
   * @param theme The theme to use
   * @returns HTML string with syntax highlighting and line numbers
   */
  static async highlightWithLineNumbers(
    code: string,
    lang: string = 'svelte',
    theme: string = 'github-dark'
  ): Promise<string> {
    try {
      await ensureShikiInitialized();
      const highlighted = await codeToHtml(code, {
        lang,
        theme
      });

      // Add line numbers to the highlighted code
      const lines = code.split('\n');
      let numberedLines = '<div class="shiki-code-with-line-numbers">';

      // Extract the tokens container from the shiki output
      const preTagStart = highlighted.indexOf('<pre');
      const preTagEnd = highlighted.indexOf('</pre>') + 6;
      const preContent = highlighted.substring(preTagStart, preTagEnd);

      // Add line number container alongside the code
      numberedLines += `
        <div class="line-numbers-container">
          ${lines.map((_, i) => `<span class="line-number">${i + 1}</span>`).join('')}
        </div>
        <div class="code-container">
          ${preContent}
        </div>
      `;

      numberedLines += '</div>';

      return numberedLines;
    } catch (error) {
      console.error('Syntax highlighting with line numbers failed:', error);
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
  }
}

/**
 * Escape HTML entities to prevent XSS when inserting raw code
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}