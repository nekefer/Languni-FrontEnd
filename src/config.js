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

  // Lemon Squeezy variant IDs (not secret — safe to expose in frontend)
  lsMonthlyVariantId: import.meta.env.VITE_LS_MONTHLY_VARIANT_ID || "",
  lsYearlyVariantId: import.meta.env.VITE_LS_YEARLY_VARIANT_ID || "",

  // PostHog
  posthogKey: import.meta.env.VITE_PUBLIC_POSTHOG_KEY || "",
  posthogHost: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
};

export default config;
