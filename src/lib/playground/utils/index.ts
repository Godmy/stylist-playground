/** AREA: STYLIST CODER MODEL -> AUTO-GENERATED */
export { colorSchemeMap, colorSchemes, defaultColorSchemeId } from './colorSchemes';
export { addToHistory, clearHistory, getAllHistory, getHistoryStats, getMostVisited, getRecentHistory, removeFromHistory, searchHistory } from './history';
export { ShortcutHelpers, deinitKeyboardShortcuts, formatShortcut, getShortcuts, initKeyboardShortcuts, isInputElement, registerShortcut, unregisterShortcut } from './keyboard';
export { clearAllPresets, deletePreset, duplicatePreset, exportPresets, getAllPresets, getFavoritePresets, getMostUsedPresets, getPresetsForStory, importPresets, incrementUsage, renamePreset, savePreset, searchPresets, toggleFavorite, updatePreset } from './presets';
export { SyntaxHighlighter } from './syntax-highlighter';
export { deserializeFromURL, generateShareURL, getCurrentURLState, serializeToURL, updateBrowserURL } from './urlState';
export type { ColorSchemeId } from './colorSchemes';
export type { KeyboardShortcut } from './keyboard';
export type { PlaygroundColorScheme } from './colorSchemes';
export type { HistoryEntry } from './history';
export type { Preset } from './presets';
export type { URLState } from './urlState';