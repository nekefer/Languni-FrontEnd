/**
 * Logger utility — logs to console in all environments.
 * Vercel captures stdout automatically.
 */

import config from "../config";

/**
 * Create a logger instance for a specific module
 * @param {string} moduleName - Name of the module (e.g., "auth", "vocabulary")
 * @returns {Object} Logger instance with debug, info, warn, error methods
 */
export function createLogger(moduleName) {
  const formatMessage = (message) => `[${moduleName}] ${message}`;

  return {
    debug: (message, data = {}) => {
      if (config.isDevelopment) {
        console.debug(formatMessage(message), data);
      }
    },

    info: (message, data = {}) => {
      console.info(formatMessage(message), data);
    },

    warn: (message, data = {}) => {
      console.warn(formatMessage(message), data);
    },

    error: (message, error = null, data = {}) => {
      console.error(formatMessage(message), error, data);
    },
  };
}

// Pre-configured loggers for common modules
export const authLogger = createLogger("auth");
export const apiLogger = createLogger("api");
export const vocabularyLogger = createLogger("vocabulary");
export const playerLogger = createLogger("player");

export default createLogger;
