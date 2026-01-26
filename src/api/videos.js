import axios from "axios";

const API_URL = "http://localhost:8000";

// ✅ Configure axios to send cookies automatically
axios.defaults.withCredentials = true;

/**
 * Videos API Service
 * Handles video recommendations, listing, and import
 */
class VideosService {
  /**
   * Get recommended videos based on user's preferences
   * @param {number} page - Page number (default 1)
   * @param {number} pageSize - Number of videos per page (default 20)
   * @returns {Promise<Object>} Paginated list of recommended videos
   */
  async getRecommendedVideos(page = 1, pageSize = 20) {
    try {
      const response = await axios.get(`${API_URL}/api/videos/recommended`, {
        params: { page, page_size: pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Get recommended videos error:", error);

      // Handle specific error for incomplete onboarding
      if (error.response?.status === 400) {
        throw new Error("Please complete onboarding to get recommendations");
      }

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to fetch recommended videos";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all videos with optional filters
   * @param {Object} options - Filter options
   * @param {string} options.language - Filter by language
   * @param {number} options.page - Page number (default 1)
   * @param {number} options.pageSize - Number of videos per page (default 20)
   * @returns {Promise<Object>} Paginated list of videos
   */
  async getAllVideos({ language = null, page = 1, pageSize = 20 } = {}) {
    try {
      const params = { page, page_size: pageSize };
      if (language) {
        params.language = language;
      }

      const response = await axios.get(`${API_URL}/api/videos`, { params });
      return response.data;
    } catch (error) {
      console.error("Get all videos error:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to fetch videos";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get a single video by YouTube video ID
   * @param {string} youtubeVideoId - YouTube video ID
   * @returns {Promise<Object>} Video data
   */
  async getVideoByYoutubeId(youtubeVideoId) {
    try {
      const response = await axios.get(
        `${API_URL}/api/videos/${encodeURIComponent(youtubeVideoId)}`,
      );
      return response.data;
    } catch (error) {
      console.error("Get video error:", error);

      if (error.response?.status === 404) {
        return null;
      }

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to fetch video";
      throw new Error(errorMessage);
    }
  }

  /**
   * Import a video from YouTube URL
   * @param {string} youtubeUrl - Full YouTube URL
   * @param {string[]} topics - Video topics
   * @param {string} difficultyLevel - Difficulty level ('beginner', 'intermediate', 'advanced')
   * @returns {Promise<Object>} Created video data
   */
  async importFromUrl(youtubeUrl, topics = [], difficultyLevel = null) {
    try {
      const response = await axios.post(`${API_URL}/api/videos/from-url`, {
        youtube_url: youtubeUrl,
        topics,
        difficulty_level: difficultyLevel,
      });
      return response.data;
    } catch (error) {
      console.error("Import video error:", error);

      // Handle duplicate video
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || "Invalid YouTube URL");
      }
      if (error.response?.status === 409) {
        throw new Error("Video already exists in database");
      }

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to import video";
      throw new Error(errorMessage);
    }
  }

  /**
   * Import a video by YouTube video ID
   * @param {string} youtubeVideoId - YouTube video ID
   * @param {string[]} topics - Video topics
   * @param {string} difficultyLevel - Difficulty level
   * @returns {Promise<Object>} Created video data
   */
  async importFromYoutubeId(
    youtubeVideoId,
    topics = [],
    difficultyLevel = null,
  ) {
    try {
      const response = await axios.post(`${API_URL}/api/videos/from-youtube`, {
        youtube_video_id: youtubeVideoId,
        topics,
        difficulty_level: difficultyLevel,
      });
      return response.data;
    } catch (error) {
      console.error("Import video error:", error);

      if (error.response?.status === 409) {
        throw new Error("Video already exists in database");
      }

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to import video";
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export default new VideosService();
