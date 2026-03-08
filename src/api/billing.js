import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

axios.defaults.withCredentials = true;

/**
 * Create a Lemon Squeezy checkout session.
 * @param {string} variantId - The LS variant ID (monthly or yearly)
 * @returns {Promise<string>} The checkout URL to redirect to
 */
export async function createCheckout(variantId) {
  const response = await axios.post(`${API_URL}/api/billing/checkout`, { variant_id: variantId });
  return response.data.checkout_url;
}

/**
 * Get the current user's subscription status.
 * @returns {Promise<Object>} { plan, status, current_period_end, cancel_at_period_end }
 */
export async function getSubscription() {
  const response = await axios.get(`${API_URL}/api/billing/subscription`);
  return response.data;
}

/**
 * Generate a Lemon Squeezy customer portal URL.
 * @returns {Promise<string>} The portal URL to redirect to
 */
export async function createPortal() {
  const response = await axios.post(`${API_URL}/api/billing/portal`);
  return response.data.portal_url;
}

/**
 * Notify the backend that the user started watching a video.
 * Returns { allowed, remaining } or throws 403 if daily limit reached.
 * @param {string} youtubeVideoId
 */
export async function startWatching(youtubeVideoId) {
  const response = await axios.post(`${API_URL}/api/videos/${youtubeVideoId}/start-watching`);
  return response.data;
}
