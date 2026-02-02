/**
 * Application configuration from environment variables
 * Vite exposes env vars prefixed with VITE_ on import.meta.env
 */

export const config = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",

  // Sentry
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || "",
  environment: import.meta.env.VITE_ENVIRONMENT || "development",

  // Helpers
  isProduction: import.meta.env.VITE_ENVIRONMENT === "production",
  isDevelopment: import.meta.env.VITE_ENVIRONMENT !== "production",
};

export default config;
