/**
 * Translation API Service
 * Uses MyMemory Translation API (free, no API key required)
 * Rate limit: ~1000 requests/day for anonymous users
 *
 * Docs: https://mymemory.translated.net/doc/spec.php
 */

import { createLogger } from "../utils/logger";

const logger = createLogger("translation");
const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";

// Simple in-memory cache to avoid redundant API calls
const translationCache = new Map();

/**
 * Generate cache key for translation
 */
function getCacheKey(text, sourceLang, targetLang) {
  return `${sourceLang}:${targetLang}:${text.toLowerCase().trim()}`;
}

/**
 * Translation Service
 */
class TranslationService {
  /**
   * Translate text from one language to another
   * @param {string} text - Text to translate
   * @param {string} sourceLang - Source language code (e.g., 'en', 'fr', 'es')
   * @param {string} targetLang - Target language code
   * @returns {Promise<string>} Translated text
   */
  async translate(text, sourceLang, targetLang) {
    if (!text || !sourceLang || !targetLang) {
      throw new Error(
        "Text, source language, and target language are required",
      );
    }

    // Don't translate if same language
    if (sourceLang === targetLang) {
      return text;
    }

    const cleanText = text.trim();
    if (!cleanText) {
      return "";
    }

    // Check cache first
    const cacheKey = getCacheKey(cleanText, sourceLang, targetLang);
    if (translationCache.has(cacheKey)) {
      logger.debug("Cache hit", { text: cleanText });
      return translationCache.get(cacheKey);
    }

    try {
      // MyMemory API uses langpair format: "en|fr"
      const langPair = `${sourceLang}|${targetLang}`;

      const response = await fetch(
        `${MYMEMORY_API_URL}?q=${encodeURIComponent(cleanText)}&langpair=${langPair}`,
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();

      // Check for API errors
      if (data.responseStatus !== 200) {
        logger.warn("MyMemory API warning", { details: data.responseDetails });
        // Still try to use the translation if available
      }

      const translatedText = data.responseData?.translatedText;

      if (!translatedText) {
        throw new Error("No translation returned");
      }

      // Cache the result
      translationCache.set(cacheKey, translatedText);

      return translatedText;
    } catch (error) {
      logger.error("Translation failed", error, { text: cleanText, sourceLang, targetLang });
      throw new Error(`Failed to translate: ${error.message}`);
    }
  }

  /**
   * Translate a word from learning language to native language
   * Convenience method for the main use case
   * @param {string} word - Word to translate
   * @param {string} learningLanguage - Language user is learning (source)
   * @param {string} nativeLanguage - User's native language (target)
   * @returns {Promise<string>} Translated word
   */
  async translateWord(word, learningLanguage, nativeLanguage) {
    return this.translate(word, learningLanguage, nativeLanguage);
  }

  /**
   * Translate multiple words at once
   * Note: Each word is a separate API call due to MyMemory limitations
   * @param {string[]} words - Array of words to translate
   * @param {string} sourceLang - Source language code
   * @param {string} targetLang - Target language code
   * @returns {Promise<Object>} Map of original word to translation
   */
  async translateBatch(words, sourceLang, targetLang) {
    const results = {};

    // Process in sequence to avoid rate limiting
    for (const word of words) {
      try {
        results[word] = await this.translate(word, sourceLang, targetLang);
        // Small delay between requests to be nice to the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        logger.error("Batch translation failed for word", error, { word });
        results[word] = null; // Mark as failed
      }
    }

    return results;
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
