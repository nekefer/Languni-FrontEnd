/**
 * Sentry initialization for error tracking
 *
 * Only initializes in production when VITE_SENTRY_DSN is set
 */

import * as Sentry from "@sentry/react";
import config from "../config";

export function initSentry() {
  // Skip if no DSN configured
  if (!config.sentryDsn) {
    if (config.isDevelopment) {
      console.debug("[sentry] Not configured (VITE_SENTRY_DSN not set)");
    }
    return;
  }

  // Skip in development unless explicitly enabled
  if (config.isDevelopment) {
    console.debug("[sentry] Disabled in development mode");
    return;
  }

  try {
    Sentry.init({
      dsn: config.sentryDsn,
      environment: config.environment,

      // Performance monitoring
      tracesSampleRate: 0.1, // Sample 10% of transactions

      // Session replay for debugging (optional, can be removed if not needed)
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      enableLogs: true,

      // Filter out non-actionable errors
      beforeSend(event) {
        // Filter out network errors that aren't actionable
        if (event.exception?.values?.[0]?.type === "ChunkLoadError") {
          return null; // User probably has slow connection
        }
        return event;
      },

      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
      ],
    });

    console.info("[sentry] Initialized successfully");
  } catch (error) {
    console.error("[sentry] Failed to initialize:", error);
  }
}

/**
 * Set user context for Sentry (call after login)
 */
export function setSentryUser(user) {
  if (!config.sentryDsn || !user) return;

  Sentry.setUser({
    id: user.id,
    email: user.email,
  });
}

/**
 * Clear user context (call after logout)
 */
export function clearSentryUser() {
  if (!config.sentryDsn) return;
  Sentry.setUser(null);
}

export default { initSentry, setSentryUser, clearSentryUser };
