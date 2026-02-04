import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { List } from "react-window";
import { toast } from "sonner";
import { getCaptions } from "../api/youtube";
import vocabularyService from "../api/vocabulary";
import { Spinner } from "../ui/Spinner";
import { playerLogger } from "../utils/logger";

// Memoized row component - OUTSIDE to prevent recreation on every render
const CaptionRow = memo(function CaptionRow({
  index,
  style,
  parsedCaptions,
  currentCaptionIndex,
  handleCaptionClick,
  handleWordClick,
}) {
  const caption = parsedCaptions[index];
  if (!caption) return null;

  const isActive = index === currentCaptionIndex;
  const captionHtml = caption.text
    .split(" ")
    .map((word) => `<span class="caption-word">${word}</span>`)
    .join(" ");

  return (
    <div
      style={style}
      className={`caption-item ${isActive ? "active" : ""}`}
      data-caption-index={index}
      onClick={() => handleCaptionClick(caption.start)}
      title={`Seek to ${Math.floor(caption.start / 60)}:${String(Math.floor(caption.start % 60)).padStart(2, "0")}`}
    >
      <div className="caption-timestamp">
        {Math.floor(caption.start / 60)}:
        {String(Math.floor(caption.start % 60)).padStart(2, "0")}
        <span className="caption-duration">
          ({caption.duration.toFixed(1)}s)
        </span>
      </div>
      <div
        className="caption-text"
        onClick={(e) => {
          if (e.target.classList.contains("caption-word")) {
            e.stopPropagation();
            const word = e.target.textContent.trim();
            handleWordClick(word, caption.start);
          }
        }}
        dangerouslySetInnerHTML={{ __html: captionHtml }}
      />
    </div>
  );
});

function CaptionPanel({
  videoId,
  currentCaptionIndex,
  getCurrentTime,
  onCaptionsLoaded,
  onSeek,
  onWordClick
}) {
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
      const fetchedCaptions = response.captions || [];
      setCaptions(fetchedCaptions);
      // Notify parent about captions for index calculation
      onCaptionsLoaded?.(fetchedCaptions);
    } catch (err) {
      playerLogger.error("Failed to fetch captions", err, { videoId });
      setError(err.message || "Failed to load captions");
    } finally {
      setLoading(false);
    }
  }, [videoId, onCaptionsLoaded]);

  // Now include fetchCaptions in the dependency array
  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

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
        `[data-caption-index="${currentCaptionIndex}"]`,
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
    [onSeek],
  );

  // Handle word click for vocabulary learning
  const handleWordClick = useCallback(
    async (word, captionStartTime) => {
      const cleanWord = word.replace(/[^\w'']/g, "").toLowerCase();

      if (!cleanWord) return;

      try {
        const captionIndex = captions.findIndex(
          (caption) => caption.start === captionStartTime,
        );

        if (captionIndex === -1) return;

        const vocabularyData = await vocabularyService.processWordClick(
          cleanWord,
          captions,
          captionIndex,
          getCurrentTime(),
        );

        if (onWordClick) {
          onWordClick(vocabularyData);
        }
      } catch (error) {
        playerLogger.error("Word processing failed", error);
        toast.error(`Can't find definition for "${cleanWord}"`);
      }
    },
    [captions, getCurrentTime, onWordClick],
  );

  // Memoize parsed captions - only stores data, no event handlers
  // This now only recalculates when captions change, not when currentTime changes
  const parsedCaptions = useMemo(() => {
    return captions.map((caption) => ({
      ...caption,
      words: caption.text.split(" "),
    }));
  }, [captions]);

  if (loading) {
    return (
      <div className="caption-panel">
        <div className="caption-loading">
          <Spinner size={24} />
          <span>Loading captions...</span>
        </div>
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

      {/* Virtualized list - only renders ~15 visible captions at a time */}
      <List
        rowComponent={CaptionRow}
        rowCount={parsedCaptions.length}
        rowHeight={80}
        rowProps={{
          parsedCaptions,
          currentCaptionIndex,
          handleCaptionClick,
          handleWordClick,
        }}
        style={{ height: 400 }}
      />
    </div>
  );
}

export default CaptionPanel;
