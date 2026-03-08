import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

// Tracks whether a refresh call is already in flight
let isRefreshing = false;

// Requests that arrived while a refresh was in progress
// Each entry is { resolve, reject } from a Promise
let queue = [];

const processQueue = (error) => {
  queue.forEach((entry) => {
    if (error) {
      entry.reject(error);
    } else {
      entry.resolve();
    }
  });
  queue = [];
};

axios.interceptors.response.use(
  // Successful responses pass through untouched
  (response) => response,

  async (error) => {
    const original = error.config;

    // Only act on 401s that haven't been retried yet.
    // Skip auth endpoints to prevent infinite loops.
    const isRetry = original._retry;
    const isRefreshEndpoint = original.url?.includes("/auth/refresh");
    const isLoginEndpoint = original.url?.includes("/auth/token");
    const isRegisterEndpoint = original.url?.includes("/auth/") && original.method === "post" && !original.url?.includes("/auth/logout");

    if (
      error.response?.status !== 401 ||
      isRetry ||
      isRefreshEndpoint ||
      isLoginEndpoint ||
      isRegisterEndpoint
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already running, queue this request until it finishes
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then(() => axios(original))
        .catch((err) => Promise.reject(err));
    }

    // Mark this request so we don't retry it again on another 401
    original._retry = true;
    isRefreshing = true;

    try {
      await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });

      // Refresh succeeded — unblock all queued requests and retry the original
      processQueue(null);
      return axios(original);
    } catch (refreshError) {
      // Refresh failed — session is dead
      processQueue(refreshError);

      // Notify the app so it can clear auth state and redirect
      window.dispatchEvent(new CustomEvent("auth:sessionExpired"));

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
