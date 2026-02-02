/**
 * Logger utility that integrates with Sentry
 *
 * In production: logs are captured by Sentry
 * In development: logs go to console
 */

import * as Sentry from "@sentry/react";
import config from "../config";

const LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
};

/**
 * Create a logger instance for a specific module
 * @param {string} moduleName - Name of the module (e.g., "auth", "vocabulary")
 * @returns {Object} Logger instance with debug, info, warn, error methods
 */
export function createLogger(moduleName) {
  const formatMessage = (message) => `[${moduleName}] ${message}`;

  return {
    /**
     * Debug level - only shown in development
     */
    debug: (message, data = {}) => {
      if (config.isDevelopment) {
        console.debug(formatMessage(message), data);
      }
    },

    /**
     * Info level - important events (sends to Sentry)
     * Use sparingly for key user actions
     */
    info: (message, data = {}) => {
      const formattedMessage = formatMessage(message);

      if (config.isDevelopment) {
        console.info(formattedMessage, data);
      }

      if (config.isProduction && config.sentryDsn) {
        Sentry.withScope((scope) => {
          scope.setTag("module", moduleName);
          scope.setExtras(data);
          Sentry.captureMessage(formattedMessage, "info");
        });
      }
    },

    /**
     * Warning level - potential issues
     */
    warn: (message, data = {}) => {
      if (config.isDevelopment) {
        console.warn(formatMessage(message), data);
      }

      if (config.isProduction && config.sentryDsn) {
        Sentry.addBreadcrumb({
          category: moduleName,
          message,
          level: "warning",
          data,
        });
      }
    },

    /**
     * Error level - errors that should be tracked
     */
    error: (message, error = null, data = {}) => {
      const formattedMessage = formatMessage(message);

      if (config.isDevelopment) {
        console.error(formattedMessage, error, data);
      }

      if (config.isProduction && config.sentryDsn) {
        Sentry.withScope((scope) => {
          scope.setTag("module", moduleName);
          scope.setExtras(data);

          if (error instanceof Error) {
            Sentry.captureException(error);
          } else {
            Sentry.captureMessage(formattedMessage, "error");
          }
        });
      }
    },

  };
}

// Pre-configured loggers for common modules
export const authLogger = createLogger("auth");
export const apiLogger = createLogger("api");
export const vocabularyLogger = createLogger("vocabulary");
export const playerLogger = createLogger("player");

export default createLogger;
