import config from "../config";

const API_URL = config.apiUrl;

class DictionaryService {
  constructor() {
    this.cache = new Map(); // In-memory cache keyed by "word:language"
    this.pendingRequests = new Map();
    this.maxCacheSize = 200;
  }

  /**
   * Fetch word definition from the backend dictionary endpoint (Wiktionary).
   * @param {string} word - The word to look up
   * @param {string} language - Language code: en, es, fr, de, it, pt
   * @returns {Promise<Object|null>} Dictionary data or null if not found
   */
  async getDefinition(word) {
    if (!word || typeof word !== "string") {
      throw new Error("Word must be a non-empty string");
    }

    const cacheKey = word.toLowerCase().trim();

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const request = this.fetchDefinition(word, cacheKey);
    this.pendingRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async fetchDefinition(word, cacheKey) {
    try {
      const response = await fetch(
        `${API_URL}/api/dictionary/${encodeURIComponent(word)}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        if (response.status === 404) {
          this.cacheResult(cacheKey, null);
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Backend already returns the normalized shape — no processing needed
      this.cacheResult(cacheKey, data);
      return data;
    } catch (error) {
      if (error.message?.includes("API error")) {
        throw error;
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }

  prefetchDefinition(word) {
    return this.getDefinition(word).catch(() => null);
  }

  /**
   * Cache API result with size management
   * @param {string} word - The word key
   * @param {Object|null} result - The result to cache
   */
  cacheResult(word, result) {
    // Manage cache size
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(word, result);
  }

  /**
   * Validate if a word is suitable for dictionary lookup
   * @param {string} word - Word to validate
   * @returns {boolean} True if word is valid for lookup
   */
  isValidWord(word) {
    if (!word || typeof word !== "string") {
      return { valid: false, type: "Invalid" };
    }

    if (/[''‹›`´]/.test(word)) {
      return { valid: true, type: "contraction", word: word };
    }

    const cleanWord = word.toLowerCase().trim();

    // Check if it's not just numbers or special characters
    if (!/[a-zA-Z]/.test(cleanWord)) {
      return { valid: false, type: "invalid" };
    }

    return { valid: true, type: "regular", word: cleanWord };
  }
}

// Export singleton instance
export default new DictionaryService();
