/**
 * Keyboard Shortcuts Manager
 */

export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

class KeyboardShortcuts {
  private shortcuts: Map<string, ShortcutConfig> = new Map();
  private enabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  private getShortcutKey(config: Omit<ShortcutConfig, 'description' | 'action'>): string {
    const parts: string[] = [];
    if (config.ctrl) parts.push('ctrl');
    if (config.alt) parts.push('alt');
    if (config.shift) parts.push('shift');
    if (config.meta) parts.push('meta');
    parts.push(config.key.toLowerCase());
    return parts.join('+');
  }

  register(config: ShortcutConfig) {
    const key = this.getShortcutKey(config);
    this.shortcuts.set(key, config);
  }

  unregister(config: Omit<ShortcutConfig, 'description' | 'action'>) {
    const key = this.getShortcutKey(config);
    this.shortcuts.delete(key);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    const parts: string[] = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    parts.push(event.key.toLowerCase());

    const key = parts.join('+');
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  getAll(): ShortcutConfig[] {
    return Array.from(this.shortcuts.values());
  }

  clear() {
    this.shortcuts.clear();
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
    this.shortcuts.clear();
  }
}

export const keyboardShortcuts = new KeyboardShortcuts();

// Helper to format shortcut display
export function formatShortcut(config: Omit<ShortcutConfig, 'description' | 'action'>): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
  const parts: string[] = [];

  if (config.ctrl) parts.push(isMac ? '⌃' : 'Ctrl');
  if (config.alt) parts.push(isMac ? '⌥' : 'Alt');
  if (config.shift) parts.push(isMac ? '⇧' : 'Shift');
  if (config.meta) parts.push(isMac ? '⌘' : 'Win');

  // Capitalize key
  const key = config.key.length === 1 ? config.key.toUpperCase() : config.key;
  parts.push(key);

  return parts.join('+');
}
