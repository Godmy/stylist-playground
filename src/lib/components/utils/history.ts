/**
 * Recent Components History Management
 * Track and manage recently visited components
 */

export interface HistoryEntry {
  storyId: string;
  timestamp: number;
  visitCount: number;
}

const STORAGE_KEY = 'playground-history';
const MAX_HISTORY_SIZE = 20;

/**
 * Get all history entries
 */
export function getAllHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored) as HistoryEntry[];

    // Sort by most recent first
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.warn('Failed to load history:', error);
    return [];
  }
}

/**
 * Add or update a story visit
 */
export function addToHistory(storyId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getAllHistory();
    const existingIndex = history.findIndex((entry) => entry.storyId === storyId);

    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex].timestamp = Date.now();
      history[existingIndex].visitCount++;
    } else {
      // Add new entry
      history.push({
        storyId,
        timestamp: Date.now(),
        visitCount: 1
      });
    }

    // Keep only MAX_HISTORY_SIZE most recent entries
    const trimmed = history
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_HISTORY_SIZE);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to add to history:', error);
  }
}

/**
 * Remove a specific entry from history
 */
export function removeFromHistory(storyId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const history = getAllHistory();
    const filtered = history.filter((entry) => entry.storyId !== storyId);

    if (filtered.length === history.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to remove from history:', error);
    return false;
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get recent history (limit entries)
 */
export function getRecentHistory(limit = 10): HistoryEntry[] {
  return getAllHistory().slice(0, limit);
}

/**
 * Get most visited components
 */
export function getMostVisited(limit = 10): HistoryEntry[] {
  const history = getAllHistory();
  return history
    .filter((entry) => entry.visitCount > 1)
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, limit);
}

/**
 * Search history by story ID
 */
export function searchHistory(query: string): HistoryEntry[] {
  const lowerQuery = query.toLowerCase();
  return getAllHistory().filter((entry) =>
    entry.storyId.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get history statistics
 */
export function getHistoryStats() {
  const history = getAllHistory();

  if (history.length === 0) {
    return {
      totalVisits: 0,
      uniqueComponents: 0,
      mostVisited: null,
      lastVisited: null
    };
  }

  const totalVisits = history.reduce((sum, entry) => sum + entry.visitCount, 0);
  const mostVisited = history.reduce((max, entry) =>
    entry.visitCount > max.visitCount ? entry : max
  );
  const lastVisited = history.reduce((latest, entry) =>
    entry.timestamp > latest.timestamp ? entry : latest
  );

  return {
    totalVisits,
    uniqueComponents: history.length,
    mostVisited,
    lastVisited
  };
}
