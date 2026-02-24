export type AIProviderId = 'gemini' | 'qwen' | 'claude' | 'codex';

const DEFAULT_WORKSPACE = 'D:/2026/code/template';

export const AI_WORKSPACE = import.meta.env.PUBLIC_AI_WORKSPACE ?? DEFAULT_WORKSPACE;

export const AI_PROVIDER_URLS: Record<AIProviderId, string> = {
  gemini: import.meta.env.PUBLIC_AI_GEMINI_URL ?? 'http://localhost:41241',
  qwen: import.meta.env.PUBLIC_AI_QWEN_URL ?? 'http://localhost:41242',
  claude: import.meta.env.PUBLIC_AI_CLAUDE_URL ?? 'http://localhost:41243',
  codex: import.meta.env.PUBLIC_AI_CODEX_URL ?? 'http://localhost:41244'
};
