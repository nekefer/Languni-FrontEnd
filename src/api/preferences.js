import axios from "axios";

const API_URL = "http://localhost:8000";

// ✅ Configure axios to send cookies automatically
axios.defaults.withCredentials = true;

/**
 * User Preferences API Service
 * Handles user onboarding preferences and learning settings
 */
class PreferencesService {
  /**
   * Get current user's preferences
   * @returns {Promise<Object>} User preferences including onboarding status
   */
  async getPreferences() {
    try {
      const response = await axios.get(`${API_URL}/api/user/preferences`);
      return response.data;
    } catch (error) {
      console.error("Get preferences error:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to fetch preferences";
      throw new Error(errorMessage);
    }
  }

  /**
   * Save user preferences (during onboarding)
   * Sets onboarding_completed to true
   * @param {Object} preferences - User preferences
   * @param {string} preferences.native_language - User's native language (e.g., 'fr', 'es')
   * @param {string} preferences.learning_language - Language user wants to learn (e.g., 'en')
   * @param {string[]} preferences.topics - Topics of interest (e.g., ['music', 'travel'])
   * @param {string} preferences.level - Learning level ('beginner', 'intermediate', 'advanced')
   * @returns {Promise<Object>} Updated preferences
   */
  async savePreferences(preferences) {
    try {
      const response = await axios.post(
        `${API_URL}/api/user/preferences`,
        preferences
      );
      return response.data;
    } catch (error) {
      console.error("Save preferences error:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to save preferences";
      throw new Error(errorMessage);
    }
  }

  /**
   * Update user preferences (from settings page)
   * @param {Object} preferences - Partial preferences to update
   * @returns {Promise<Object>} Updated preferences
   */
  async updatePreferences(preferences) {
    try {
      const response = await axios.put(
        `${API_URL}/api/user/preferences`,
        preferences
      );
      return response.data;
    } catch (error) {
      console.error("Update preferences error:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to update preferences";
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if user has completed onboarding
   * @returns {Promise<boolean>} Whether onboarding is completed
   */
  async isOnboardingCompleted() {
    try {
      const prefs = await this.getPreferences();
      return prefs.onboarding_completed || false;
    } catch (error) {
      console.error("Check onboarding error:", error);
      return false;
    }
  }
}

// Export singleton instance
export default new PreferencesService();
