import { useEffect, useState } from "react";

/**
 * Debounce hook for delaying value updates
 * Useful for search, validation checks, and other operations that should wait for user to stop typing
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout if value changes before delay completes
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Advanced debounce hook for async operations (like API calls)
 * Executes a callback with debouncing
 *
 * @param {Function} callback - Async function to call
 * @param {Array} dependencies - Dependency array
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {object} { isPending: boolean, error: Error | null }
 */
export const useDebouncedEffect = (
  callback,
  dependencies = [],
  delay = 500
) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsPending(true);
    const handler = setTimeout(async () => {
      try {
        await callback();
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsPending(false);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, dependencies);

  return { isPending, error };
};
