/**
 * Translation API Service
 * Proxies through the backend which uses Google Translate via deep-translator.
 * Languages are determined server-side from the user's profile preferences.
 */

import axios from "axios";
import config from "../config";
import { createLogger } from "../utils/logger";

const logger = createLogger("translation");
const API_URL = config.apiUrl;

// Client-side cache to avoid redundant API calls
const translationCache = new Map();

/**
 * Generate cache key for translation
 */
function getCacheKey(text, options = {}) {
  return [
    text.toLowerCase().trim(),
    options.sourceLanguage || "profile",
    options.targetLanguage || "profile",
  ].join(":");
}

/**
 * Translation Service
 */
class TranslationService {
  /**
   * Translate text using the user's language preferences (read server-side).
   * @param {string} text - Text to translate
   * @returns {Promise<{translatedText: string, sourceLanguage: string, targetLanguage: string}>}
   */
  async translate(text, options = {}) {
    if (!text) {
      throw new Error("Text is required");
    }

    const cleanText = text.trim();
    if (!cleanText) {
      return { translatedText: "", sourceLanguage: "", targetLanguage: "" };
    }

    const cacheKey = getCacheKey(cleanText, options);
    if (translationCache.has(cacheKey)) {
      logger.debug("Client cache hit", { text: cleanText });
      return translationCache.get(cacheKey);
    }

    try {
      const response = await axios.post(`${API_URL}/api/translate`, {
        text: cleanText,
        sourceLanguage: options.sourceLanguage || null,
        targetLanguage: options.targetLanguage || null,
      });

      const data = response.data;
      translationCache.set(cacheKey, data);
      return data;
    } catch (error) {
      logger.error("Translation failed", error, { text: cleanText });
      throw new Error(`Failed to translate: ${error.response?.data?.detail || error.message}`);
    }
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    translationCache.clear();
  }

  /**
   * Get cache size
   * @returns {number} Number of cached translations
   */
  getCacheSize() {
    return translationCache.size;
  }
}

// Export singleton instance
export default new TranslationService();
