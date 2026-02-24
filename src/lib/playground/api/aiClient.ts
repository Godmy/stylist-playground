/**
 * Unified API client for AI servers (Gemini & Qwen)
 */
import { AI_PROVIDER_URLS, AI_WORKSPACE, type AIProviderId } from '../config/ai';

export interface AIServerConfig {
  baseUrl: string;
  workspace: string;
  providerId: AIProviderId;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
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

export interface ChatResponse {
  sessionId: string;
  text: string;
  finishReason?: string;
  model: string;
}

export interface FileReadRequest {
  path: string;
  maxBytes?: number;
}

export interface FileReadResponse {
  path: string;
  content: string;
  truncated: boolean;
}

export interface ShellRequest {
  command: string;
  directory?: string;
}

export interface ShellResponse {
  llmContent?: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
}

export interface ToolsResponse {
  apiEndpoints: Array<{
    name: string;
    endpoint: string;
    method: string;
    description: string;
    parameters?: string;
    children?: Array<{
      name: string;
      endpoint: string;
      method: string;
      description: string;
      parameters?: string;
    }>;
  }>;
  cliCoreTools?: Array<{
    name: string;
    displayName?: string;
    description?: string;
    parameters?: unknown;
  }>;
}

/**
 * Unified AI API Client
 */
export class AIClient {
  private config: AIServerConfig;
  private sessionId: string | null = null;

  constructor(config: AIServerConfig) {
    this.config = config;
  }

  /**
   * Send a chat message
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.request('/v1/chat', {
        workspace: this.config.workspace,
        prompt: request.prompt,
        sessionId: request.sessionId || this.sessionId,
        autoApproveTools: request.autoApproveTools ?? true,
        stream: request.stream ?? false,
        contextFiles: request.contextFiles,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || `Chat request failed: ${response.status} ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();
      this.sessionId = data.sessionId;
      return data;
    } catch (err) {
      // Network errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error(`Cannot connect to ${this.config.providerId} server at ${this.config.baseUrl}. Make sure the server is running.`);
      }
      throw err;
    }
  }

  /**
   * Read a file from workspace
   */
  async readFile(request: FileReadRequest): Promise<FileReadResponse> {
    const response = await this.request('/v1/files/read', {
      workspace: this.config.workspace,
      path: request.path,
      maxBytes: request.maxBytes,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'File read failed');
    }

    return await response.json();
  }

  /**
   * Execute a shell command
   */
  async shell(request: ShellRequest): Promise<ShellResponse> {
    const response = await this.request('/v1/shell', {
      workspace: this.config.workspace,
      command: request.command,
      directory: request.directory,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Shell command failed');
    }

    return await response.json();
  }

  /**
   * Get available tools
   */
  async getTools(): Promise<ToolsResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/v1/tools?workspace=${encodeURIComponent(this.config.workspace)}`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Failed to fetch tools');
    }

    return await response.json();
  }

  /**
   * Reset session
   */
  resetSession(): void {
    this.sessionId = null;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Internal request method
   */
  private async request(endpoint: string, body: unknown): Promise<Response> {
    return await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}

/**
 * AI Client factory
 */
export function createAIClient(providerId: AIServerConfig['providerId']): AIClient {
  const configs: Record<AIServerConfig['providerId'], Partial<AIServerConfig>> = {
    gemini: { baseUrl: AI_PROVIDER_URLS.gemini, workspace: AI_WORKSPACE },
    qwen: { baseUrl: AI_PROVIDER_URLS.qwen, workspace: AI_WORKSPACE },
    claude: { baseUrl: AI_PROVIDER_URLS.claude, workspace: AI_WORKSPACE },
    codex: { baseUrl: AI_PROVIDER_URLS.codex, workspace: AI_WORKSPACE }
  };

  const config = configs[providerId];
  if (!config.baseUrl || !config.workspace) {
    throw new Error(`Invalid provider ID: ${providerId}`);
  }

  return new AIClient({
    ...config,
    providerId,
  } as AIServerConfig);
}
