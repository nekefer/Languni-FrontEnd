/**
 * Application configuration from environment variables
 * Vite exposes env vars prefixed with VITE_ on import.meta.env
 */

export const config = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",

  // Environment
  environment: import.meta.env.VITE_ENVIRONMENT || "development",

  // Helpers
  isProduction: import.meta.env.VITE_ENVIRONMENT === "production",
  isDevelopment: import.meta.env.VITE_ENVIRONMENT !== "production",

  // Google
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",

  // PostHog
  posthogKey: import.meta.env.VITE_PUBLIC_POSTHOG_KEY || "",
  posthogHost: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
};

export default config;
