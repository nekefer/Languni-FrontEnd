import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { List, useListRef } from "react-window";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getCaptions } from "../api/youtube";
import vocabularyService from "../api/vocabulary";
import { Spinner } from "../ui/Spinner";
import expandContractions from "@stdlib/nlp-expand-contractions";
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
      <div className="caption-text">
        {caption.text.split(" ").map((word, i) => (
          <span
            key={i}
            className="caption-word"
            onClick={(e) => {
              e.stopPropagation();
              handleWordClick(word, index);
            }}
          >
            {word}{" "}
          </span>
        ))}
      </div>
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
  const { t } = useTranslation();
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useListRef();
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

  // Auto-scroll to active caption using virtualized list API
  useEffect(() => {
    if (
      currentCaptionIndex === -1 ||
      currentCaptionIndex === lastScrolledIndexRef.current
    ) {
      return;
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!listRef.current) return;

      listRef.current.scrollToRow({
        index: currentCaptionIndex,
        align: "center",
        behavior: "smooth",
      });
      lastScrolledIndexRef.current = currentCaptionIndex;
    }, 50);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentCaptionIndex, listRef]);

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
    async (word, captionIndex) => {
      const cleanWord = word.replace(/[^\w''-]/g, "").toLowerCase();

      if (!cleanWord) return;

      try {
        const expanded = expandContractions(cleanWord);
        const isContraction = expanded !== cleanWord;

        const vocabularyData = await vocabularyService.processWordClick(
          isContraction ? expanded.split(" ")[0] : cleanWord,
          captions,
          captionIndex,
          getCurrentTime(),
        );

        if (isContraction) {
          vocabularyData.expandedForm = expanded;
          vocabularyData.originalWord = cleanWord;
        }

        if (onWordClick) {
          onWordClick(vocabularyData);
        }
      } catch (error) {
        playerLogger.error("Word processing failed", error);
        toast.error(t('player.noDefinition', { word: cleanWord }));
      }
    },
    [captions, getCurrentTime, onWordClick, t],
  );

  const parsedCaptions = useMemo(() => captions, [captions]);

  if (loading) {
    return (
      <div className="caption-panel">
        <div className="caption-loading">
          <Spinner size={24} />
          <span>{t('player.loadingCaptions')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="caption-panel">
        <div className="caption-error">
          <p>{t('player.captionsFailed')}</p>
          <button onClick={fetchCaptions} className="retry-button">
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!parsedCaptions.length) {
    return (
      <div className="caption-panel">
        <div className="caption-empty">
          {t('player.noCaptions')}
        </div>
      </div>
    );
  }

  return (
    <div className="caption-panel">
      <div className="caption-header">
        <h3>{t('player.captions')}</h3>
        <p className="caption-info">
          {t('player.captionHint')}
        </p>
      </div>

      {/* Virtualized list - only renders ~15 visible captions at a time */}
      <List
        listRef={listRef}
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
