/**
 * Logger utility — dev only.
 * In production all methods are no-ops so nothing leaks to the browser console.
 */

import config from "../config";

const noop = () => {};

export function createLogger(moduleName) {
  if (config.isProduction) {
    return { debug: noop, info: noop, warn: noop, error: noop };
  }

  const fmt = (msg) => `[${moduleName}] ${msg}`;

  return {
    debug: (message, data = {})        => console.debug(fmt(message), data),
    info:  (message, data = {})        => console.info(fmt(message), data),
    warn:  (message, data = {})        => console.warn(fmt(message), data),
    error: (message, error = null, data = {}) => console.error(fmt(message), error, data),
  };
}

// Pre-configured loggers for common modules
export const authLogger = createLogger("auth");
export const apiLogger = createLogger("api");
export const vocabularyLogger = createLogger("vocabulary");
export const playerLogger = createLogger("player");

export default createLogger;
