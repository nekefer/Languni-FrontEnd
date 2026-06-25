import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

axios.defaults.withCredentials = true;

export const getTrendingVideos = async ({
  region = "US",
  maxResults = 25,
  pageToken = null,
  categoryId = null,
} = {}) => {
  const params = new URLSearchParams();
  params.append("region", region);
  params.append("max_results", maxResults);
  if (pageToken) params.append("page_token", pageToken);
  if (categoryId) params.append("category_id", categoryId);

  const response = await axios.get(`${API_URL}/youtube/trending?${params.toString()}`);
  return response.data;
};

export const getCuratedVideos = async () => {
  const response = await axios.get(`${API_URL}/youtube/curated`);
  return response.data;
};

export const getLastLikedVideo = async () => {
  const response = await axios.get(`${API_URL}/youtube/last-liked-video`);
  return response.data;
};

export const getCaptions = async (videoId, options = {}) => {
  const response = await axios.get(`${API_URL}/youtube/${videoId}/captions`, {
    params: {
      native_language: options.nativeLanguage,
      learning_language: options.learningLanguage,
    },
  });
  return response.data;
};
