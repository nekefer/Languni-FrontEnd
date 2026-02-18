import axios from "axios";
import config from "../config";
import { createLogger } from "../utils/logger";

const API_URL = config.apiUrl;
const logger = createLogger("savedVideos");

axios.defaults.withCredentials = true;

class SavedVideosService {
  /**
   * Save a video to user's library
   * @param {string} youtubeVideoId - YouTube video ID
   * @returns {Promise<Object>} Save result
   */
  async saveVideo(youtubeVideoId) {
    try {
      const response = await axios.post(`${API_URL}/api/saved-videos`, {
        youtube_video_id: youtubeVideoId,
      });
      logger.debug("Video saved", { youtubeVideoId });
      return response.data;
    } catch (error) {
      logger.error("Failed to save video", error, { youtubeVideoId });
      const errorMessage =
        error.response?.data?.detail || error.message || "Failed to save video";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get user's saved videos with pagination
   * @param {number} skip - Number of videos to skip
   * @param {number} limit - Number of videos to fetch
   * @returns {Promise<Object>} Paginated saved videos
   */
  async getSavedVideos(skip = 0, limit = 12) {
    try {
      const response = await axios.get(`${API_URL}/api/saved-videos`, {
        params: { skip, limit },
      });
      return response.data;
    } catch (error) {
      logger.error("Failed to get saved videos", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to fetch saved videos";
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if a video is already saved
   * @param {string} youtubeVideoId - YouTube video ID
   * @returns {Promise<boolean>} Whether the video is saved
   */
  async isVideoSaved(youtubeVideoId) {
    try {
      if (!youtubeVideoId) return false;
      const response = await axios.get(
        `${API_URL}/api/saved-videos/check/${encodeURIComponent(youtubeVideoId)}`,
      );
      return response.data.saved || false;
    } catch (error) {
      logger.error("Failed to check video status", error, { youtubeVideoId });
      return false;
    }
  }

  /**
   * Remove a video from user's library
   * @param {string} youtubeVideoId - YouTube video ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteSavedVideo(youtubeVideoId) {
    try {
      const response = await axios.delete(
        `${API_URL}/api/saved-videos/${encodeURIComponent(youtubeVideoId)}`,
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to delete saved video", error, { youtubeVideoId });
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to delete video";
      throw new Error(errorMessage);
    }
  }
}

export default new SavedVideosService();
