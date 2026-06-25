import { useState, useEffect } from "react";
import { getCuratedVideos } from "../api/youtube";

export function useCurated({ enabled = true } = {}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setVideos([]);
      setLoading(false);
      setError(null);
      return () => { cancelled = true; };
    }

    setLoading(true);
    setError(null);

    getCuratedVideos()
      .then((data) => {
        if (!cancelled) setVideos(data.items || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.detail || "Failed to load recommendations");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [enabled]);

  return { videos, loading, error };
}
