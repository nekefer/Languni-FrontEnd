import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Optimistic toggle with debounced DB sync.
 *
 * - Updates UI immediately on every toggle (no waiting for API)
 * - Waits `debounceMs` after the last toggle before calling the API
 * - Skips the API call entirely if the final state matches the last committed DB state
 *   (e.g. save → unsave within 800ms = 0 API calls)
 * - Reverts UI to last committed state on API error
 *
 * @param {string|number} id         - ID of the item (video_id, word). Changing it re-fetches.
 * @param {Function} fetchSaved      - async () => boolean — check initial DB state
 * @param {Function} onSave          - async () => void — called when final state is "saved"
 * @param {Function} onUnsave        - async () => void — called when final state is "unsaved"
 * @param {Function} [onError]       - (error) => void — called on API failure after UI revert
 * @param {number}   [debounceMs=800]
 */
export const useOptimisticToggle = ({
  id,
  fetchSaved,
  onSave,
  onUnsave,
  onError,
  debounceMs = 1000,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [checking, setChecking] = useState(true);

  // Refs to avoid stale closures in the debounce callback
  const committedRef = useRef(false);   // last confirmed DB state
  const optimisticRef = useRef(false);  // current UI state
  const timerRef = useRef(null);

  // Keep callback refs up to date without making them deps of toggle
  const fetchSavedRef = useRef(fetchSaved);
  const onSaveRef = useRef(onSave);
  const onUnsaveRef = useRef(onUnsave);
  const onErrorRef = useRef(onError);

  fetchSavedRef.current = fetchSaved;
  onSaveRef.current = onSave;
  onUnsaveRef.current = onUnsave;
  onErrorRef.current = onError;

  // Fetch initial saved state whenever the target item changes
  useEffect(() => {
    if (!id) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    setChecking(true);

    fetchSavedRef
      .current()
      .then((saved) => {
        if (cancelled) return;
        committedRef.current = saved;
        optimisticRef.current = saved;
        setIsSaved(saved);
        setChecking(false);
      })
      .catch(() => {
        if (cancelled) return;
        committedRef.current = false;
        optimisticRef.current = false;
        setIsSaved(false);
        setChecking(false);
      });

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id]);

  const toggle = useCallback(() => {
    if (checking) return;

    // Flip optimistic state immediately
    const next = !optimisticRef.current;
    optimisticRef.current = next;
    setIsSaved(next);

    // Reset debounce timer
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      // User toggled back to where they started — no DB call needed
      if (next === committedRef.current) return;

      try {
        if (next) {
          await onSaveRef.current();
        } else {
          await onUnsaveRef.current();
        }
        committedRef.current = next;
      } catch (error) {
        // Revert UI to last committed DB state
        optimisticRef.current = committedRef.current;
        setIsSaved(committedRef.current);
        onErrorRef.current?.(error);
      }
    }, debounceMs);
  }, [checking, debounceMs]);

  return { isSaved, checking, toggle };
};
