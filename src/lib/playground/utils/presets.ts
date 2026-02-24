/**
 * Props Presets Management
 * Save, load, and manage control value presets
 */

export interface Preset {
  id: string;
  name: string;
  storyId: string;
  values: Record<string, any>;
  favorite: boolean;
  usageCount: number;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'playground-presets';

/**
 * Get all presets from localStorage
 */
export function getAllPresets(): Preset[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const presets = JSON.parse(stored) as Preset[];
    return presets.sort((a, b) => {
      // Favorites first
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      // Then by usage count
      if (a.usageCount !== b.usageCount) {
        return b.usageCount - a.usageCount;
      }
      // Then by most recent
      return b.updatedAt - a.updatedAt;
    });
  } catch (error) {
    console.warn('Failed to load presets:', error);
    return [];
  }
}

/**
 * Get presets for a specific story
 */
export function getPresetsForStory(storyId: string): Preset[] {
  return getAllPresets().filter((p) => p.storyId === storyId);
}

/**
 * Get favorite presets
 */
export function getFavoritePresets(): Preset[] {
  return getAllPresets().filter((p) => p.favorite);
}

/**
 * Save a new preset
 */
export function savePreset(
  name: string,
  storyId: string,
  values: Record<string, any>,
  favorite = false
): Preset {
  const presets = getAllPresets();

  const preset: Preset = {
    id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    storyId,
    values,
    favorite,
    usageCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  presets.push(preset);
  savePresets(presets);

  return preset;
}

/**
 * Update an existing preset
 */
export function updatePreset(id: string, updates: Partial<Preset>): Preset | null {
  const presets = getAllPresets();
  const index = presets.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const updated = {
    ...presets[index],
    ...updates,
    updatedAt: Date.now()
  };

  presets[index] = updated;
  savePresets(presets);

  return updated;
}

/**
 * Delete a preset
 */
export function deletePreset(id: string): boolean {
  const presets = getAllPresets();
  const filtered = presets.filter((p) => p.id !== id);

  if (filtered.length === presets.length) return false;

  savePresets(filtered);
  return true;
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(id: string): Preset | null {
  const presets = getAllPresets();
  const preset = presets.find((p) => p.id === id);

  if (!preset) return null;

  return updatePreset(id, { favorite: !preset.favorite });
}

/**
 * Increment usage count
 */
export function incrementUsage(id: string): Preset | null {
  const presets = getAllPresets();
  const preset = presets.find((p) => p.id === id);

  if (!preset) return null;

  return updatePreset(id, { usageCount: preset.usageCount + 1 });
}

/**
 * Rename a preset
 */
export function renamePreset(id: string, newName: string): Preset | null {
  return updatePreset(id, { name: newName });
}

/**
 * Duplicate a preset
 */
export function duplicatePreset(id: string): Preset | null {
  const preset = getAllPresets().find((p) => p.id === id);

  if (!preset) return null;

  return savePreset(
    `${preset.name} (Copy)`,
    preset.storyId,
    { ...preset.values },
    preset.favorite
  );
}

/**
 * Export presets to JSON
 */
export function exportPresets(): string {
  const presets = getAllPresets();
  return JSON.stringify(presets, null, 2);
}

/**
 * Import presets from JSON
 */
export function importPresets(json: string): number {
  try {
    const imported = JSON.parse(json) as Preset[];
    const existing = getAllPresets();

    // Merge, avoiding duplicates by ID
    const merged = [...existing];
    let addedCount = 0;

    imported.forEach((preset) => {
      if (!existing.find((p) => p.id === preset.id)) {
        merged.push(preset);
        addedCount++;
      }
    });

    savePresets(merged);
    return addedCount;
  } catch (error) {
    console.error('Failed to import presets:', error);
    return 0;
  }
}

/**
 * Clear all presets
 */
export function clearAllPresets(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Internal: Save presets to localStorage
 */
function savePresets(presets: Preset[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save presets:', error);
  }
}

/**
 * Get most used presets
 */
export function getMostUsedPresets(limit = 5): Preset[] {
  return getAllPresets()
    .filter((p) => p.usageCount > 0)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

/**
 * Search presets by name
 */
export function searchPresets(query: string): Preset[] {
  const lowerQuery = query.toLowerCase();
  return getAllPresets().filter((p) => p.name.toLowerCase().includes(lowerQuery));
}