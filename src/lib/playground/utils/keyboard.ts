/**
 * Keyboard shortcut utility for the Playground
 */

// Define the type for keyboard shortcuts
export type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Command key on Mac, Windows key on Windows
  description: string;
  action: () => void | Promise<void>;
};

// Store for registered shortcuts
const shortcuts: KeyboardShortcut[] = [];

function isSameShortcut(a: KeyboardShortcut, b: KeyboardShortcut): boolean {
  return (
    a.key.toLowerCase() === b.key.toLowerCase() &&
    Boolean(a.ctrl) === Boolean(b.ctrl) &&
    Boolean(a.shift) === Boolean(b.shift) &&
    Boolean(a.alt) === Boolean(b.alt) &&
    Boolean(a.meta) === Boolean(b.meta)
  );
}

/**
 * Register a keyboard shortcut
 */
export function registerShortcut(shortcut: KeyboardShortcut): void {
  const existingIndex = shortcuts.findIndex((item) => isSameShortcut(item, shortcut));
  if (existingIndex >= 0) {
    shortcuts[existingIndex] = shortcut;
    return;
  }
  shortcuts.push(shortcut);
}

/**
 * Unregister a keyboard shortcut
 */
export function unregisterShortcut(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean, meta?: boolean): void {
  const index = shortcuts.findIndex(s =>
    s.key === key &&
    s.ctrl === ctrl &&
    s.shift === shift &&
    s.alt === alt &&
    s.meta === meta
  );

  if (index !== -1) {
    shortcuts.splice(index, 1);
  }
}

/**
 * Get all registered shortcuts
 */
export function getShortcuts(): KeyboardShortcut[] {
  return [...shortcuts];
}

// Keep track of active shortcuts handler
let isActive = false;

/**
 * Initialize keyboard shortcuts handling
 */
export function initKeyboardShortcuts(): void {
  if (isActive || typeof document === 'undefined') return;

  document.addEventListener('keydown', handleKeyDown);
  isActive = true;
}

/**
 * Deinitialize keyboard shortcuts handling
 */
export function deinitKeyboardShortcuts(): void {
  if (typeof document === 'undefined') return;
  
  document.removeEventListener('keydown', handleKeyDown);
  isActive = false;
  shortcuts.length = 0;
}

/**
 * Handle keydown events
 */
function handleKeyDown(event: KeyboardEvent): void {
  // Only handle events in browser environment
  if (typeof document === 'undefined') return;
  
  // Find matching shortcut
  const target = event.target;
  if (target instanceof Element && isInputElement(target)) {
    return;
  }

  const matchingShortcut = shortcuts.find(shortcut => {
    const ctrlMetaMatches = shortcut.ctrl && shortcut.meta
      ? event.ctrlKey || event.metaKey
      : Boolean(event.ctrlKey) === Boolean(shortcut.ctrl) &&
        Boolean(event.metaKey) === Boolean(shortcut.meta);

    return (
      event.key.toLowerCase() === shortcut.key.toLowerCase() &&
      ctrlMetaMatches &&
      Boolean(event.shiftKey) === Boolean(shortcut.shift) &&
      Boolean(event.altKey) === Boolean(shortcut.alt)
    );
  });

  if (matchingShortcut) {
    event.preventDefault();
    matchingShortcut.action();
  }
}

/**
 * Check if a specific element is focused (to avoid shortcuts when typing in inputs)
 */
export function isInputElement(element: Element): boolean {
  return (
    element.tagName === 'INPUT' ||
    element.tagName === 'TEXTAREA' ||
    element.tagName === 'SELECT' ||
    element.hasAttribute('contenteditable')
  );
}

/**
 * Helper function to create standardized shortcuts for common actions
 */
export const ShortcutHelpers = {
  // Search stories: Cmd/Ctrl + K
  searchStories: (action: () => void): KeyboardShortcut => ({
    key: 'k',
    ctrl: true,
    meta: true,
    description: 'Search stories',
    action
  }),

  // Toggle sidebar: Cmd/Ctrl + B
  toggleSidebar: (action: () => void): KeyboardShortcut => ({
    key: 'b',
    ctrl: true,
    meta: true,
    description: 'Toggle sidebar',
    action
  }),

  // Toggle dark mode: Cmd/Ctrl + D
  toggleDarkMode: (action: () => void): KeyboardShortcut => ({
    key: 'd',
    ctrl: true,
    meta: true,
    description: 'Toggle dark mode',
    action
  }),

  // Show help: Cmd/Ctrl + /
  showHelp: (action: () => void): KeyboardShortcut => ({
    key: '/',
    ctrl: true,
    meta: true,
    description: 'Show help',
    action
  }),

  // Close modals: Esc
  closeModal: (action: () => void): KeyboardShortcut => ({
    key: 'Escape',
    description: 'Close modals',
    action
  })
};

/**
 * Format shortcut for display (e.g., "Ctrl+D" or "⌘D" on Mac)
 */
export function formatShortcut(config: Omit<KeyboardShortcut, 'description' | 'action'>): string {
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
