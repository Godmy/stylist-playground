/**
 * URL State Management Utilities
 * Handles serialization/deserialization of playground state to/from URL params
 */

import type { ViewportSize } from '../types';
import type { BackgroundType } from '../stores/playground.svelte';

export interface URLState {
  // Component selection
  storyId?: string;

  // UI State
  viewport?: ViewportSize;
  darkMode?: boolean;
  background?: BackgroundType;
  showGrid?: boolean;
  zoom?: number;

  // Panel states
  sidebarOpen?: boolean;
  bottomTab?: string;
  sidebarTab?: string;

  // Control values (compressed as JSON)
  props?: Record<string, any>;
}

/**
 * Compress object to URL-safe base64 string
 */
function compressToURL(obj: any): string {
  try {
    const json = JSON.stringify(obj);
    // Use btoa for base64 encoding, replace URL-unsafe chars
    return btoa(json)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error('Failed to compress to URL:', e);
    return '';
  }
}

/**
 * Decompress URL-safe base64 string to object
 */
function decompressFromURL(str: string): any {
  try {
    // Restore URL-unsafe chars
    const base64 = str
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if needed
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(base64 + padding);

    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decompress from URL:', e);
    return null;
  }
}

/**
 * Serialize playground state to URL params
 */
export function serializeToURL(state: URLState): string {
  const params = new URLSearchParams();

  // Simple params (don't compress)
  if (state.storyId) params.set('story', state.storyId);
  if (state.viewport) params.set('viewport', state.viewport);
  if (state.darkMode !== undefined) params.set('dark', state.darkMode ? '1' : '0');
  if (state.background) params.set('bg', state.background);
  if (state.showGrid !== undefined) params.set('grid', state.showGrid ? '1' : '0');
  if (state.zoom !== undefined && state.zoom !== 1) params.set('zoom', state.zoom.toFixed(2));
  if (state.sidebarOpen !== undefined) params.set('sidebar', state.sidebarOpen ? '1' : '0');
  if (state.bottomTab) params.set('btab', state.bottomTab);
  if (state.sidebarTab) params.set('stab', state.sidebarTab);

  // Compress props if present
  if (state.props && Object.keys(state.props).length > 0) {
    const compressed = compressToURL(state.props);
    if (compressed) params.set('p', compressed);
  }

  return params.toString();
}

/**
 * Deserialize URL params to playground state
 */
export function deserializeFromURL(search: string): URLState {
  const params = new URLSearchParams(search);
  const state: URLState = {};

  // Simple params
  const storyId = params.get('story');
  if (storyId) state.storyId = storyId;

  const viewport = params.get('viewport');
  if (viewport && ['mobile', 'tablet', 'desktop', 'fullscreen'].includes(viewport)) {
    state.viewport = viewport as ViewportSize;
  }

  const darkMode = params.get('dark');
  if (darkMode !== null) state.darkMode = darkMode === '1';

  const background = params.get('bg');
  if (background && ['white', 'gray', 'dark', 'transparent'].includes(background)) {
    state.background = background as BackgroundType;
  }

  const showGrid = params.get('grid');
  if (showGrid !== null) state.showGrid = showGrid === '1';

  const zoom = params.get('zoom');
  if (zoom) {
    const zoomNum = parseFloat(zoom);
    if (!isNaN(zoomNum) && zoomNum >= 0.1 && zoomNum <= 5) {
      state.zoom = zoomNum;
    }
  }

  const sidebarOpen = params.get('sidebar');
  if (sidebarOpen !== null) state.sidebarOpen = sidebarOpen === '1';

  const bottomTab = params.get('btab');
  if (bottomTab) state.bottomTab = bottomTab;

  const sidebarTab = params.get('stab');
  if (sidebarTab) state.sidebarTab = sidebarTab;

  // Decompress props
  const propsCompressed = params.get('p');
  if (propsCompressed) {
    const props = decompressFromURL(propsCompressed);
    if (props && typeof props === 'object') {
      state.props = props;
    }
  }

  return state;
}

/**
 * Update browser URL without reloading the page
 */
export function updateBrowserURL(state: URLState, replaceState = false) {
  if (typeof window === 'undefined') return;

  const urlParams = serializeToURL(state);
  const newURL = urlParams ? `${window.location.pathname}?${urlParams}` : window.location.pathname;

  if (replaceState) {
    window.history.replaceState({}, '', newURL);
  } else {
    window.history.pushState({}, '', newURL);
  }
}

/**
 * Get current URL state
 */
export function getCurrentURLState(): URLState {
  if (typeof window === 'undefined') return {};
  return deserializeFromURL(window.location.search);
}

/**
 * Generate shareable URL with current state
 */
export function generateShareURL(state: URLState): string {
  if (typeof window === 'undefined') return '';

  const urlParams = serializeToURL(state);
  const baseURL = window.location.origin + window.location.pathname;

  return urlParams ? `${baseURL}?${urlParams}` : baseURL;
}

/**
 * Copy URL to clipboard
 */
export async function copyURLToClipboard(url: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (e) {
    console.error('Failed to copy URL:', e);
    return false;
  }
}
