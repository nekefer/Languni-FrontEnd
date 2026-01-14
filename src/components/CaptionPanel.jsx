import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { getCaptions } from "../api/youtube";
import vocabularyService from "../api/vocabulary";

function CaptionPanel({ videoId, currentTime, onSeek, onWordClick }) {
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const captionPanelRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const lastScrolledIndexRef = useRef(-1);

  // Memoize the function with useCallback
  const fetchCaptions = useCallback(async () => {
    if (!videoId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getCaptions(videoId);
      setCaptions(response.captions || []);
    } catch (err) {
      console.error("Failed to fetch captions:", err);
      setError(err.message || "Failed to load captions");
    } finally {
      setLoading(false);
    }
  }, [videoId]); // Dependencies for useCallback

  // Now include fetchCaptions in the dependency array
  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  // Memoize currentCaptionIndex to prevent recalculating on every render
  const currentCaptionIndex = useMemo(() => {
    if (!captions.length) return -1;

    const bufferTime = 0.2;
    const adjustedTime = currentTime + bufferTime;

    for (let i = 0; i < captions.length; i++) {
      const caption = captions[i];
      const nextCaption = captions[i + 1];

      if (adjustedTime >= caption.start) {
        if (!nextCaption || adjustedTime < nextCaption.start) {
          return i;
        }
      }
    }

    return -1;
  }, [captions, currentTime]);

  // Optimized auto-scroll with RAF and debouncing
  useEffect(() => {
    // Skip if no change or invalid index
    if (
      currentCaptionIndex === -1 ||
      currentCaptionIndex === lastScrolledIndexRef.current
    ) {
      return;
    }

    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce scroll to prevent rapid consecutive scrolls
    scrollTimeoutRef.current = setTimeout(() => {
      if (!captionPanelRef.current) return;

      const captionElement = captionPanelRef.current.querySelector(
        `[data-caption-index="${currentCaptionIndex}"]`
      );

      if (captionElement) {
        const container = captionPanelRef.current;
        const containerRect = container.getBoundingClientRect();
        const elementRect = captionElement.getBoundingClientRect();

        const isInView =
          elementRect.top >= containerRect.top &&
          elementRect.bottom <= containerRect.bottom;

        if (!isInView) {
          // Use RAF to ensure DOM has updated before scrolling
          requestAnimationFrame(() => {
            captionElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            lastScrolledIndexRef.current = currentCaptionIndex;
          });
        } else {
          lastScrolledIndexRef.current = currentCaptionIndex;
        }
      }
    }, 50); // 50ms debounce

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentCaptionIndex]);

  // Handle caption card click (seek to beginning of caption)
  const handleCaptionClick = useCallback(
    (captionStartTime) => {
      const buffer = 0.1;
      onSeek?.(captionStartTime - buffer);
    },
    [onSeek]
  );

  // Handle word click for vocabulary learning
  const handleWordClick = useCallback(
    async (word, captionStartTime) => {
      const cleanWord = word.replace(/[^\w'']/g, "").toLowerCase();

      if (!cleanWord) return;

      try {
        const captionIndex = captions.findIndex(
          (caption) => caption.start === captionStartTime
        );

        if (captionIndex === -1) return;

        const vocabularyData = await vocabularyService.processWordClick(
          cleanWord,
          captions,
          captionIndex,
          currentTime
        );

        if (onWordClick) {
          onWordClick(vocabularyData);
        }
      } catch (error) {
        console.error("Word processing error:", error);
        alert(`Error loading definition for "${cleanWord}": ${error.message}`);
      }
    },
    [captions, currentTime, onWordClick]
  );

  // Memoize parsed captions to prevent re-parsing on every render
  const parsedCaptions = useMemo(() => {
    return captions.map((caption) => {
      const words = caption.text.split(" ");
      return {
        ...caption,
        parsedWords: words.map((word, index) => (
          <span
            key={index}
            className="caption-word"
            onClick={(e) => {
              e.stopPropagation();
              handleWordClick(word, caption.start);
            }}
            title={`Get definition for "${word}"`}
          >
            {word}{" "}
          </span>
        )),
      };
    });
  }, [captions, handleWordClick]);

  if (loading) {
    return (
      <div className="caption-panel">
        <div className="caption-loading">Loading captions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="caption-panel">
        <div className="caption-error">
          <p>Failed to load captions</p>
          <button onClick={fetchCaptions} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!parsedCaptions.length) {
    return (
      <div className="caption-panel">
        <div className="caption-empty">
          No captions available for this video
        </div>
      </div>
    );
  }

  return (
    <div className="caption-panel" ref={captionPanelRef}>
      <div className="caption-header">
        <h3>Captions</h3>
        <p className="caption-info">
          Click caption to seek • Click words for definitions
        </p>
      </div>

      <div className="caption-list">
        {parsedCaptions.map((caption, index) => (
          <div
            key={index}
            className={`caption-item ${index === currentCaptionIndex ? "active" : ""}`}
            data-caption-index={index}
            onClick={() => handleCaptionClick(caption.start)}
            style={{ cursor: "pointer" }}
            title={`Seek to ${Math.floor(caption.start / 60)}:${String(Math.floor(caption.start % 60)).padStart(2, "0")}`}
          >
            <div className="caption-timestamp">
              {Math.floor(caption.start / 60)}:
              {String(Math.floor(caption.start % 60)).padStart(2, "0")}
              <span className="caption-duration">
                ({caption.duration.toFixed(1)}s)
              </span>
            </div>
            <div className="caption-text">{caption.parsedWords}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CaptionPanel;
