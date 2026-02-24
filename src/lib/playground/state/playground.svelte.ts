/**
 * Playground State Management
 * Using Svelte 5 runes for reactive state
 */

import type {
  PlaygroundState,
  StoryConfig,
  ControlConfig,
  ViewportSize,
  Notification,
  NotificationType
} from '../types';
import {
  applyThemeToDOM,
  darkTheme,
  lightTheme,
  type Theme,
  type ThemeName
} from '@stylist-svelte/design-system';
import {
  deserializeFromURL,
  updateBrowserURL,
  getCurrentURLState,
  generateShareURL,
  copyURLToClipboard,
  type URLState
} from '../utils/urlState';
import {
  savePreset,
  getPresetsForStory,
  getAllPresets,
  getFavoritePresets,
  updatePreset,
  deletePreset,
  toggleFavorite,
  incrementUsage,
  renamePreset,
  duplicatePreset,
  type Preset
} from '../utils/presets';
import {
  addToHistory,
  getRecentHistory,
  getMostVisited,
  removeFromHistory,
  clearHistory,
  getHistoryStats,
  type HistoryEntry
} from '../utils/history';
import {
  colorSchemes,
  colorSchemeMap,
  defaultColorSchemeId,
  type ColorSchemeId,
  type PlaygroundColorScheme
} from '../utils/colorSchemes';

export type BackgroundType = 'white' | 'gray' | 'dark' | 'transparent';

// Re-export types for convenience
export type {
  PlaygroundState,
  StoryConfig,
  ControlConfig,
  URLState,
  Preset,
  HistoryEntry,
  Notification,
  NotificationType
};

const THEME_STORAGE_KEY = 'stylist-theme';
const LEGACY_THEME_STORAGE_KEY = 'theme';
const THEMES: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme
};

class PlaygroundStore {
  // Core state
  state = $state<PlaygroundState>({
    currentStoryId: null,
    darkMode: false,
    sidebarOpen: true,
    viewport: 'desktop',
    showCode: false,
    controlsOpen: true,
    bottomTab: 'controls',
    sidebarTab: 'variants'
  });

  // Extended UI state for playground
  uiState = $state({
    background: 'white' as BackgroundType,
    showGrid: false,
    showRulers: false,
    zoom: 1,
    bottomPanelOpen: true,
    showDeviceFrame: false,
    colorScheme: defaultColorSchemeId as ColorSchemeId,
    // Visibility for panels, centralized from layout/page components
    componentTreeOpen: true,
    aiPanelOpen: false,
    // Search and filter state from navigation.ts
    searchQuery: '',
    typeFilter: null as string | null,
    // Drawing state shared between playground layout and page
    drawingMode: false,
    drawColor: '#ef4444'
  });

  // Notification state
  notifications = $state<Notification[]>([]);
  #notificationIdCounter = 0;

  // Stories registry
  stories = $state<Map<string, StoryConfig>>(new Map());

  // Control values for current story
  controlValues = $state<Record<string, any>>({});

  private applyTheme(themeName: ThemeName) {
    if (typeof window === 'undefined') return;

    const theme = THEMES[themeName] ?? lightTheme;
    applyThemeToDOM(theme);

    document.documentElement.setAttribute('data-theme', themeName);
    document.documentElement.classList.toggle('dark', themeName === 'dark');

    // Persist with new and legacy keys
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    localStorage.setItem(LEGACY_THEME_STORAGE_KEY, themeName);
  }

  // Methods
  registerStory(story: StoryConfig) {
    const wasEmpty = this.stories.size === 0;
    const isSameStory = this.state.currentStoryId === story.id;
    const existingStory = this.stories.get(story.id);

    // Check if story actually changed - compare stringified version to avoid deep comparison
    const storyChanged = !existingStory || JSON.stringify(existingStory) !== JSON.stringify(story);

    if (storyChanged) {
      this.stories.set(story.id, story);
    }

    if (wasEmpty || this.state.currentStoryId === null) {
      this.setCurrentStory(story.id);
      return;
    }

    // Only re-set current story if it's the same story AND it actually changed
    if (isSameStory && storyChanged) {
      this.setCurrentStory(story.id);
    }
  }

  unregisterStory(id: string) {
    this.stories.delete(id);

    if (this.state.currentStoryId === id) {
      const next = this.stories.keys().next().value ?? null;
      this.setCurrentStory(next ?? null);
    }
  }

  setCurrentStory(id: string | null) {
    const previousId = this.state.currentStoryId;
    const previousValues = this.controlValues;

    this.state.currentStoryId = id;

    // Add to history when switching stories
    if (id && id !== previousId) {
      addToHistory(id);
    }

    if (!id) {
      this.controlValues = {};
      return;
    }

    const story = this.stories.get(id);

    if (!story) {
      this.controlValues = {};
      return;
    }

    if (story.controls && story.controls.length > 0) {
      const mergedValues = story.controls.reduce((acc, control) => {
        if (previousId === id && control.name in previousValues) {
          acc[control.name] = previousValues[control.name];
        } else {
          acc[control.name] = control.defaultValue;
        }
        return acc;
      }, {} as Record<string, any>);

      this.controlValues = mergedValues;
    } else {
      this.controlValues = {};
    }
  }

  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
  }

  setViewport(viewport: PlaygroundState['viewport']) {
    this.state.viewport = viewport;
  }

  toggleCode() {
    this.state.showCode = !this.state.showCode;
  }

  toggleControls() {
    this.state.controlsOpen = !this.state.controlsOpen;
  }

  updateControl(name: string, value: any) {
    this.controlValues[name] = value;
  }

  // Extended UI methods
  setBackground(bg: BackgroundType) {
    this.uiState.background = bg;
  }

  toggleGrid() {
    this.uiState.showGrid = !this.uiState.showGrid;
  }

  toggleRulers() {
    this.uiState.showRulers = !this.uiState.showRulers;
  }

  setZoom(zoom: number) {
    this.uiState.zoom = Math.max(0.25, Math.min(2, zoom));
  }

  zoomIn() {
    this.setZoom(this.uiState.zoom + 0.1);
  }

  zoomOut() {
    this.setZoom(this.uiState.zoom - 0.1);
  }

  resetZoom() {
    this.uiState.zoom = 1;
  }

  toggleBottomPanel() {
    this.uiState.bottomPanelOpen = !this.uiState.bottomPanelOpen;
  }

  toggleDeviceFrame() {
    this.uiState.showDeviceFrame = !this.uiState.showDeviceFrame;
  }

  setBottomTab(tab: 'controls' | 'code' | 'export' | 'shortcuts' | 'actions' | 'variants' | 'presets') {
    this.state.bottomTab = tab;
  }

  setSidebarTab(tab: 'variants' | 'props' | 'docs' | 'code' | 'a11y' | 'history') {
    this.state.sidebarTab = tab;
  }

  // New methods for centralized panel visibility
  toggleComponentTree() {
    this.uiState.componentTreeOpen = !this.uiState.componentTreeOpen;
    // Ensure AI panel is closed if component tree is opened
    if (this.uiState.componentTreeOpen && this.uiState.aiPanelOpen) {
      this.uiState.aiPanelOpen = false;
    }
  }

  toggleAIPanel() {
    this.uiState.aiPanelOpen = !this.uiState.aiPanelOpen;
    // Ensure component tree is closed if AI panel is opened
    if (this.uiState.aiPanelOpen && this.uiState.componentTreeOpen) {
      this.uiState.componentTreeOpen = false;
    }
  }

  // New methods for centralized navigation state
  setSearchQuery(query: string) {
    this.uiState.searchQuery = query;
  }

  clearSearch() {
    this.uiState.searchQuery = '';
  }

  toggleTypeFilter(type: string) {
    this.uiState.typeFilter = this.uiState.typeFilter === type.toLowerCase() ? null : type.toLowerCase();
  }

  toggleDrawingMode() {
    this.uiState.drawingMode = !this.uiState.drawingMode;
  }

  setDrawingMode(value: boolean) {
    this.uiState.drawingMode = value;
  }

  setDrawColor(color: string) {
    this.uiState.drawColor = color;
  }

  toggleDarkMode() {
    const nextTheme: ThemeName = this.state.darkMode ? 'light' : 'dark';
    this.state.darkMode = nextTheme === 'dark';
    this.applyTheme(nextTheme);
  }

  setColorScheme(id: ColorSchemeId) {
    if (!colorSchemeMap.has(id)) return;
    this.uiState.colorScheme = id;
    this.applyColorScheme(id);
    this.saveToLocalStorage();
    localStorage.setItem('playground-color-scheme', id);
  }

  init() {
    // Check for saved theme or system preference
    const savedTheme =
      localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme: ThemeName =
      savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light';
    this.state.darkMode = initialTheme === 'dark';
    this.applyTheme(initialTheme);

    // Restore persisted state from localStorage
    this.restoreFromLocalStorage();
    this.applyTheme(this.state.darkMode ? 'dark' : 'light');
    const persistedScheme =
      localStorage.getItem('playground-color-scheme') as ColorSchemeId | null;
    if (persistedScheme && colorSchemeMap.has(persistedScheme)) {
      this.uiState.colorScheme = persistedScheme;
    }
    this.applyColorScheme(this.uiState.colorScheme);

    // Start auto-save
    this.startAutoSave();
  }

  // Notification Methods
  addNotification(message: string, type: NotificationType = 'info', duration: number = 3000) {
    const id = `notification-${Date.now()}-${this.#notificationIdCounter++}`;
    const notification: Notification = { id, message, type, duration };

    this.notifications = [...this.notifications, notification];

    if (duration > 0) {
      setTimeout(() => this.removeNotification(id), duration);
    }
    return id;
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(item => item.id !== id);
  }

  clearNotifications() {
    this.notifications = [];
  }

  success(message: string, duration?: number) {
    return this.addNotification(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.addNotification(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    return this.addNotification(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    return this.addNotification(message, 'info', duration);
  }


  // localStorage Persistence Methods

  private saveToLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
      const stateToSave = {
        state: {
          currentStoryId: this.state.currentStoryId,
          viewport: this.state.viewport,
          darkMode: this.state.darkMode,
          sidebarOpen: this.state.sidebarOpen,
          bottomTab: this.state.bottomTab,
          sidebarTab: this.state.sidebarTab
        },
        uiState: {
          background: this.uiState.background,
          showGrid: this.uiState.showGrid,
          zoom: this.uiState.zoom,
          bottomPanelOpen: this.uiState.bottomPanelOpen,
          colorScheme: this.uiState.colorScheme,
          showDeviceFrame: this.uiState.showDeviceFrame,
          // Persist new UI states
          componentTreeOpen: this.uiState.componentTreeOpen,
          aiPanelOpen: this.uiState.aiPanelOpen,
          searchQuery: this.uiState.searchQuery,
          typeFilter: this.uiState.typeFilter,
          drawingMode: this.uiState.drawingMode,
          drawColor: this.uiState.drawColor
        },
        controlValues: this.controlValues,
        timestamp: Date.now()
      };

      localStorage.setItem('playground-state', JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save playground state to localStorage:', error);
    }
  }

  private restoreFromLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('playground-state');
      if (!saved) return;

      const parsed = JSON.parse(saved);

      // Check if state is not too old (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      if (parsed.timestamp && Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem('playground-state');
        return;
      }

      // Restore state (but don't override URL state)
      if (parsed.state) {
        // Only restore if URL doesn't have these values
        const urlState = getCurrentURLState();

        if (!urlState.storyId && parsed.state.currentStoryId) {
          this.state.currentStoryId = parsed.state.currentStoryId;
        }
        if (!urlState.viewport && parsed.state.viewport) {
          this.state.viewport = parsed.state.viewport;
        }
        if (urlState.darkMode === undefined && parsed.state.darkMode !== undefined) {
          this.state.darkMode = parsed.state.darkMode;
        }
        if (urlState.sidebarOpen === undefined && parsed.state.sidebarOpen !== undefined) {
          this.state.sidebarOpen = parsed.state.sidebarOpen;
        }
        if (!urlState.bottomTab && parsed.state.bottomTab) {
          this.state.bottomTab = parsed.state.bottomTab;
        }
        if (!urlState.sidebarTab && parsed.state.sidebarTab) {
          this.state.sidebarTab = parsed.state.sidebarTab;
        }
      }

      if (parsed.uiState) {
        if (!getCurrentURLState().background && parsed.uiState.background) {
          this.uiState.background = parsed.uiState.background;
        }
        if (getCurrentURLState().showGrid === undefined && parsed.uiState.showGrid !== undefined) {
          this.uiState.showGrid = parsed.uiState.showGrid;
        }
        if (getCurrentURLState().zoom === undefined && parsed.uiState.zoom !== undefined) {
          this.uiState.zoom = parsed.uiState.zoom;
        }
        if (parsed.uiState.bottomPanelOpen !== undefined) {
          this.uiState.bottomPanelOpen = parsed.uiState.bottomPanelOpen;
        }
        if (parsed.uiState.colorScheme && colorSchemeMap.has(parsed.uiState.colorScheme)) {
          this.uiState.colorScheme = parsed.uiState.colorScheme as ColorSchemeId;
        }
        if (parsed.uiState.showDeviceFrame !== undefined) {
          this.uiState.showDeviceFrame = parsed.uiState.showDeviceFrame;
        }
        // Restore new UI states
        if (parsed.uiState.componentTreeOpen !== undefined) {
          this.uiState.componentTreeOpen = parsed.uiState.componentTreeOpen;
        }
        if (parsed.uiState.aiPanelOpen !== undefined) {
          this.uiState.aiPanelOpen = parsed.uiState.aiPanelOpen;
        }
        if (parsed.uiState.searchQuery) {
          this.uiState.searchQuery = parsed.uiState.searchQuery;
        }
        if (parsed.uiState.typeFilter) {
          this.uiState.typeFilter = parsed.uiState.typeFilter;
        }
        if (parsed.uiState.drawingMode !== undefined) {
          this.uiState.drawingMode = parsed.uiState.drawingMode;
        }
        if (typeof parsed.uiState.drawColor === 'string') {
          this.uiState.drawColor = parsed.uiState.drawColor;
        }
      }

      // Restore control values if no URL props
      if (!getCurrentURLState().props && parsed.controlValues) {
        this.controlValues = parsed.controlValues;
      }
    } catch (error) {
      console.warn('Failed to restore playground state from localStorage:', error);
    }
  }

  private autoSaveTimer: number | null = null;

  private startAutoSave() {
    if (typeof window === 'undefined') return;

    // Use $effect to track changes
    $effect(() => {
      // Track all reactive state
      const _ = [
        this.state.currentStoryId,
        this.state.viewport,
        this.state.darkMode,
        this.state.sidebarOpen,
        this.state.bottomTab,
        this.state.sidebarTab,
        this.uiState.background,
        this.uiState.showGrid,
        this.uiState.zoom,
        this.uiState.bottomPanelOpen,
        this.uiState.colorScheme,
        this.controlValues,
        // track new state
        this.uiState.componentTreeOpen,
        this.uiState.aiPanelOpen,
        this.uiState.searchQuery,
        this.uiState.typeFilter,
        this.uiState.drawingMode,
        this.uiState.drawColor,
        this.notifications
      ];

      // Debounce save
      if (this.autoSaveTimer) {
        clearTimeout(this.autoSaveTimer);
      }

      this.autoSaveTimer = setTimeout(() => {
        this.saveToLocalStorage();
      }, 1000) as unknown as number;
    });
  }

  private applyColorScheme(id: ColorSchemeId) {
    if (typeof document === 'undefined') return;

    const scheme = colorSchemeMap.get(id) ?? colorSchemeMap.get(defaultColorSchemeId)!;
    const root = document.documentElement;

    root.style.setProperty('--playground-accent', scheme.accent);
    root.style.setProperty('--playground-accent-strong', scheme.accentStrong);
    root.style.setProperty('--playground-accent-contrast', scheme.accentContrast);
    root.style.setProperty('--playground-accent-surface', scheme.surface);
    root.style.setProperty('--playground-accent-surface-strong', scheme.surfaceStrong);
    root.style.setProperty('--playground-accent-shadow', scheme.shadow);
    root.style.setProperty('--playground-spinner-border', scheme.spinner);
    root.style.setProperty('--playground-gradient-light-from', scheme.gradient.light.from);
    root.style.setProperty('--playground-gradient-light-via', scheme.gradient.light.via);
    root.style.setProperty('--playground-gradient-light-to', scheme.gradient.light.to);
    root.style.setProperty('--playground-gradient-dark-from', scheme.gradient.dark.from);
    root.style.setProperty('--playground-gradient-dark-via', scheme.gradient.dark.via);
    root.style.setProperty('--playground-gradient-dark-to', scheme.gradient.dark.to);
    root.style.setProperty('--playground-glow-light-1', scheme.glowLight[0]);
    root.style.setProperty('--playground-glow-light-2', scheme.glowLight[1]);
    root.style.setProperty('--playground-glow-dark-1', scheme.glowDark[0]);
    root.style.setProperty('--playground-glow-dark-2', scheme.glowDark[1]);

    if (scheme.componentTokens?.primary) {
      Object.entries(scheme.componentTokens.primary).forEach(([scale, value]) => {
        root.style.setProperty(`--color-primary-${scale}`, value);
      });
    }
  }

  clearLocalStorage() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('playground-state');
  }

  // Presets Management Methods

  /**
   * Save current control values as a preset
   */
  saveAsPreset(name: string, favorite = false): Preset | null {
    if (!this.state.currentStoryId) return null;

    const preset = savePreset(
      name,
      this.state.currentStoryId,
      { ...this.controlValues },
      favorite
    );

    return preset;
  }

  /**
   * Load a preset and apply its values
   */
  loadPreset(presetId: string): boolean {
    const presets = getAllPresets();
    const preset = presets.find((p) => p.id === presetId);

    if (!preset) return false;

    // Check if preset is for current story
    if (preset.storyId !== this.state.currentStoryId) {
      // Switch to the story if needed
      this.setCurrentStory(preset.storyId);
    }

    // Apply values
    this.controlValues = { ...preset.values };

    // Increment usage count
    incrementUsage(presetId);

    return true;
  }

  /**
   * Get presets for current story
   */
  getCurrentStoryPresets(): Preset[] {
    if (!this.state.currentStoryId) return [];
    return getPresetsForStory(this.state.currentStoryId);
  }

  /**
   * Get all favorite presets
   */
  getFavoritePresets(): Preset[] {
    return getFavoritePresets();
  }

  /**
   * Toggle preset favorite status
   */
  togglePresetFavorite(presetId: string): Preset | null {
    return toggleFavorite(presetId);
  }

  /**
   * Delete a preset
   */
  deletePreset(presetId: string): boolean {
    return deletePreset(presetId);
  }

  /**
   * Rename a preset
   */
  renamePreset(presetId: string, newName: string): Preset | null {
    return renamePreset(presetId, newName);
  }

  /**
   * Duplicate a preset
   */
  duplicatePreset(presetId: string): Preset | null {
    return duplicatePreset(presetId);
  }

  /**
   * Check if current values match a preset
   */
  isPresetActive(presetId: string): boolean {
    const presets = getAllPresets();
    const preset = presets.find((p) => p.id === presetId);

    if (!preset) return false;
    if (preset.storyId !== this.state.currentStoryId) return false;

    // Deep compare values
    return JSON.stringify(preset.values) === JSON.stringify(this.controlValues);
  }

  // History Management Methods

  /**
   * Get recent component history
   */
  getRecentHistory(limit = 10): HistoryEntry[] {
    return getRecentHistory(limit);
  }

  /**
   * Get most visited components
   */
  getMostVisited(limit = 10): HistoryEntry[] {
    return getMostVisited(limit);
  }

  /**
   * Remove component from history
   */
  removeFromHistory(storyId: string): boolean {
    return removeFromHistory(storyId);
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    clearHistory();
  }

  /**
   * Get history statistics
   */
  getHistoryStats() {
    return getHistoryStats();
  }

  /**
   * Navigate to a story from history
   */
  navigateToHistory(storyId: string): boolean {
    const story = this.stories.get(storyId);
    if (!story) return false;

    this.setCurrentStory(storyId);
    return true;
  }

  getCurrentStory(): StoryConfig | undefined {
    if (!this.state.currentStoryId) return undefined;
    return this.stories.get(this.state.currentStoryId);
  }

  getStoriesByCategory(): Map<string, StoryConfig[]> {
    const categorized = new Map<string, StoryConfig[]>();

    this.stories.forEach((story) => {
      const category = story.category || 'Uncategorized';
      const list = categorized.get(category) || [];
      list.push(story);
      categorized.set(category, list);
    });

    const sorted = new Map<string, StoryConfig[]>();

    [...categorized.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, stories]) => {
        const orderedStories = [...stories].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        sorted.set(category, orderedStories);
      });

    return sorted;
  }

  // URL State Management Methods

  /**
   * Restore state from URL on page load
   */
  restoreFromURL() {
    if (typeof window === 'undefined') return;

    const urlState = getCurrentURLState();

    // Restore UI state
    if (urlState.viewport) this.state.viewport = urlState.viewport;
    if (urlState.darkMode !== undefined) {
      this.state.darkMode = urlState.darkMode;
      this.applyTheme(urlState.darkMode ? 'dark' : 'light');
    }
    if (urlState.background) this.uiState.background = urlState.background;
    if (urlState.showGrid !== undefined) this.uiState.showGrid = urlState.showGrid;
    if (urlState.zoom !== undefined) this.uiState.zoom = urlState.zoom;
    if (urlState.sidebarOpen !== undefined) this.state.sidebarOpen = urlState.sidebarOpen;
    if (urlState.bottomTab) this.state.bottomTab = urlState.bottomTab as any;
    if (urlState.sidebarTab) this.state.sidebarTab = urlState.sidebarTab as any;

    // Restore story and props
    if (urlState.storyId) {
      this.state.currentStoryId = urlState.storyId;
      if (urlState.props) {
        this.controlValues = { ...urlState.props };
      }
    }

    // Ensure DOM theme matches restored state
    this.applyTheme(this.state.darkMode ? 'dark' : 'light');
  }

  /**
   * Sync current state to URL
   */
  syncToURL(replaceState = true) {
    if (typeof window === 'undefined') return;

    const urlState: URLState = {
      storyId: this.state.currentStoryId || undefined,
      viewport: this.state.viewport,
      darkMode: this.state.darkMode,
      background: this.uiState.background,
      showGrid: this.uiState.showGrid,
      zoom: this.uiState.zoom !== 1 ? this.uiState.zoom : undefined,
      sidebarOpen: this.state.sidebarOpen,
      bottomTab: this.state.bottomTab,
      sidebarTab: this.state.sidebarTab,
      props: Object.keys(this.controlValues).length > 0 ? this.controlValues : undefined
    };

    updateBrowserURL(urlState, replaceState);
  }

  /**
   * Generate shareable URL with current state
   */
  getShareURL(): string {
    const urlState: URLState = {
      storyId: this.state.currentStoryId || undefined,
      viewport: this.state.viewport,
      darkMode: this.state.darkMode,
      background: this.uiState.background,
      showGrid: this.uiState.showGrid,
      zoom: this.uiState.zoom !== 1 ? this.uiState.zoom : undefined,
      props: Object.keys(this.controlValues).length > 0 ? this.controlValues : undefined
    };

    return generateShareURL(urlState);
  }

  /**
   * Copy shareable URL to clipboard
   */
  async copyShareURL(): Promise<boolean> {
    const url = this.getShareURL();
    return await copyURLToClipboard(url);
  }
}

// Export singleton instance
export const playgroundStore = new PlaygroundStore();
export default playgroundStore;
