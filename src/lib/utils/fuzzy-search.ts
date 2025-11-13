/**
 * Fuzzy Search Implementation
 * Provides fast, intelligent searching with highlighting
 */

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: number[];
}

export interface SearchOptions {
  keys?: string[];
  threshold?: number;
  caseSensitive?: boolean;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Find fuzzy matches in a string
 */
function fuzzyMatch(pattern: string, text: string, caseSensitive = false): { score: number; indices: number[] } | null {
  if (!pattern || !text) return null;

  const searchPattern = caseSensitive ? pattern : pattern.toLowerCase();
  const searchText = caseSensitive ? text : text.toLowerCase();

  let patternIdx = 0;
  let textIdx = 0;
  const indices: number[] = [];
  let consecutiveMatches = 0;
  let score = 0;

  while (patternIdx < searchPattern.length && textIdx < searchText.length) {
    if (searchPattern[patternIdx] === searchText[textIdx]) {
      indices.push(textIdx);
      consecutiveMatches++;
      score += 1 + consecutiveMatches; // Bonus for consecutive matches
      patternIdx++;
    } else {
      consecutiveMatches = 0;
    }
    textIdx++;
  }

  // All pattern characters must be matched
  if (patternIdx !== searchPattern.length) {
    return null;
  }

  // Calculate score based on match quality
  const matchRatio = indices.length / text.length;
  const distanceScore = 100 - levenshteinDistance(searchPattern, searchText);
  const finalScore = (score * 10) + (matchRatio * 50) + distanceScore;

  return { score: finalScore, indices };
}

/**
 * Search through items using fuzzy matching
 */
export function fuzzySearch<T extends Record<string, any>>(
  query: string,
  items: T[],
  options: SearchOptions = {}
): SearchResult<T>[] {
  const {
    keys = ['name', 'title', 'label'],
    threshold = 0,
    caseSensitive = false
  } = options;

  if (!query) return items.map(item => ({ item, score: 0, matches: [] }));

  const results: SearchResult<T>[] = [];

  for (const item of items) {
    let bestScore = -Infinity;
    let bestMatches: number[] = [];

    // Search through all specified keys
    for (const key of keys) {
      const value = item[key];
      if (typeof value !== 'string') continue;

      const result = fuzzyMatch(query, value, caseSensitive);
      if (result && result.score > bestScore) {
        bestScore = result.score;
        bestMatches = result.indices;
      }
    }

    // Add to results if score meets threshold
    if (bestScore > threshold) {
      results.push({
        item,
        score: bestScore,
        matches: bestMatches
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Highlight matches in text
 */
export function highlightMatches(text: string, indices: number[]): string {
  if (!indices || indices.length === 0) return text;

  let result = '';
  let lastIndex = 0;

  for (const index of indices) {
    result += text.substring(lastIndex, index);
    result += `<mark class="bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-white">${text[index]}</mark>`;
    lastIndex = index + 1;
  }

  result += text.substring(lastIndex);
  return result;
}

/**
 * Simple search with highlighting (for quick searches)
 */
export function quickSearch(query: string, text: string): { matches: boolean; highlighted: string } {
  if (!query) return { matches: true, highlighted: text };

  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  if (!lowerText.includes(lowerQuery)) {
    return { matches: false, highlighted: text };
  }

  const index = lowerText.indexOf(lowerQuery);
  const highlighted =
    text.substring(0, index) +
    `<mark class="bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-white px-0.5">` +
    text.substring(index, index + query.length) +
    `</mark>` +
    text.substring(index + query.length);

  return { matches: true, highlighted };
}
