import axios from "axios";
import dictionaryService from "./dictionary.js";
import config from "../config";
import { vocabularyLogger } from "../utils/logger";

const API_URL = config.apiUrl;

// Configure axios to send cookies automatically
axios.defaults.withCredentials = true;

class VocabularyService {
  constructor() {
    // This service handles vocabulary word processing and context capture
    // Note: Analytics and statistics tracking should be handled by the backend
  }

  /**
   * Capture context when user clicks on a word
   * @param {string} word - The clicked word
   * @param {Array} captions - All available captions
   * @param {number} currentIndex - Current caption index
   * @param {number} currentTime - Current video time
   * @returns {Object} Context data for the word
   */
  captureWordContext(word, captions, currentIndex, currentTime) {
    if (!word || !captions || currentIndex < 0) {
      throw new Error("Invalid parameters for context capture");
    }

    const context = this.buildContext(captions, currentIndex);
    const contextData = {
      word: word.toLowerCase().trim(),
      timestamp: currentTime,
      captureTime: new Date().toISOString(),
      context: context,
      videoPosition: {
        index: currentIndex,
        total: captions.length,
      },
    };

    return contextData;
  }

  /**
   * Build context from surrounding captions
   * @param {Array} captions - All captions
   * @param {number} currentIndex - Current caption index
   * @returns {Object} Context object with previous, current, and next captions
   */
  buildContext(captions, currentIndex) {
    const context = {
      previous: [],
      current: null,
      next: [],
    };

    // Get current caption
    if (currentIndex >= 0 && currentIndex < captions.length) {
      context.current = {
        text: captions[currentIndex].text,
      };
    }

    // Get previous captions (up to 2)
    for (let i = Math.max(0, currentIndex - 2); i < currentIndex; i++) {
      if (captions[i]) {
        context.previous.push({
          text: captions[i].text,
        });
      }
    }

    // Get next captions (up to 2)
    for (
      let i = currentIndex + 1;
      i < Math.min(captions.length, currentIndex + 3);
      i++
    ) {
      if (captions[i]) {
        context.next.push({
          text: captions[i].text,
        });
      }
    }

    return context;
  }

  /**
   * Process word click and get complete vocabulary data
   * @param {string} word - The clicked word
   * @param {Array} captions - All captions
   * @param {number} currentIndex - Current caption index
   * @param {number} currentTime - Current video time
   * @returns {Promise<Object>} Complete vocabulary data
   */
  async processWordClick(word, captions, currentIndex, currentTime) {
    try {
      // Validate word
      if (!dictionaryService.isValidWord(word)) {
        throw new Error(`"${word}" is not a valid word for dictionary lookup`);
      }

      // Capture context
      const contextData = this.captureWordContext(
        word,
        captions,
        currentIndex,
        currentTime,
      );

      // Get dictionary definition — language is determined server-side from user profile
      const definition = await dictionaryService.getDefinition(word);

      if (!definition) {
        throw new Error(`No definition found for "${word}"`);
      }

      // Combine context and definition
      const vocabularyData = {
        ...contextData,
        definition: definition,
      };

      vocabularyLogger.debug("Vocabulary data processed", { word: vocabularyData.word });

      return vocabularyData;
    } catch (error) {
      vocabularyLogger.error("Failed to process vocabulary", error, { word });
      throw error;
    }
  }

  /**
   * Save a word to user's vocabulary collection
   * @param {string} word - The word to save (already validated when modal opened)
   * @param {string} videoId - ID of the video where the word was encountered
   * @returns {Promise<Object>} Save result
   */
  async saveWord(word, videoId, { translation, nativeLanguage, definition } = {}) {
    try {
      const cleanWord = word.toLowerCase().trim();

      const saveData = {
        word: cleanWord,
        youtube_video_id: videoId || null,
        translation: translation || null,
        native_language: nativeLanguage || null,
        definition: definition || null,
      };

      const response = await axios.post(`${API_URL}/vocabulary/save`, saveData);

      vocabularyLogger.debug("Word saved", { word: cleanWord });
      return response.data;
    } catch (error) {
      vocabularyLogger.error("Failed to save word", error, { word });
      const errorMessage =
        error.response?.data?.detail || error.message || "Failed to save word";
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if a word is already saved
   * @param {string} word - The word to check
   * @returns {Promise<boolean>} Whether the word is saved
   */
  async isWordSaved(word) {
    try {
      if (!word) return { saved: false };

      const cleanWord = word.toLowerCase().trim();
      const response = await axios.get(
        `${API_URL}/vocabulary/check/${encodeURIComponent(cleanWord)}`,
      );

      return response.data; // { word, saved, definition, translation, native_language }
    } catch (error) {
      vocabularyLogger.error("Failed to check word status", error, { word });
      return { saved: false };
    }
  }

  /**
   * Get user's saved words
   * @param {number} skip - Number of words to skip
   * @param {number} limit - Number of words to fetch
   * @returns {Promise<Object>} List of saved words
   */
  async getSavedWords(skip = 0, limit = 100) {
    try {
      const response = await axios.get(`${API_URL}/vocabulary/saved`, {
        params: { skip, limit },
      });

      return response.data;
    } catch (error) {
      vocabularyLogger.error("Failed to get saved words", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to fetch saved words";
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a saved word
   * @param {string} word - The word to delete
   * @returns {Promise<Object>} Delete result
   */
  async deleteSavedWord(word) {
    try {
      const cleanWord = word.toLowerCase().trim();
      const response = await axios.delete(
        `${API_URL}/vocabulary/${encodeURIComponent(cleanWord)}`,
      );

      return response.data;
    } catch (error) {
      vocabularyLogger.error("Failed to delete word", error, { word });
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to delete word";
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export default new VocabularyService();
