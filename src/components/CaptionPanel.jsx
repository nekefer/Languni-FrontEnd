import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { create } from "zustand";
import { List, useListRef } from "react-window";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getCaptions } from "../api/youtube";
import vocabularyService from "../api/vocabulary";
import { Spinner } from "../ui/Spinner";
import expandContractions from "@stdlib/nlp-expand-contractions";
import { playerLogger } from "../utils/logger";
import captionStyles from "../styles/CaptionPanel.module.css";

// Isolated store — only the 2 rows that change active state re-render
const useActiveCaptionStore = create((set) => ({
  activeIndex: -1,
  setActiveIndex: (index) => set({ activeIndex: index }),
}));

const formatTimestamp = (seconds) => {
  const safeSeconds = Math.max(0, seconds || 0);
  return `${Math.floor(safeSeconds / 60)}:${String(Math.floor(safeSeconds % 60)).padStart(2, "0")}`;
};

// Memoized row component - OUTSIDE to prevent recreation on every render
const CaptionRow = memo(function CaptionRow({
  index,
  style,
  parsedCaptions,
  handleCaptionClick,
  handleWordClick,
}) {
  const caption = parsedCaptions[index];
  const isActive = useActiveCaptionStore((s) => s.activeIndex === index);

  if (!caption) return null;

  return (
    <div
      style={style}
      className={`${captionStyles.captionItem}${isActive ? ` ${captionStyles.active}` : ""}`}
      data-caption-index={index}
      onClick={() => handleCaptionClick(caption.start)}
      title={`Seek to ${formatTimestamp(caption.start)}`}
    >
      <div className={captionStyles.captionTimestamp}>
        {formatTimestamp(caption.start)}
        <span className={captionStyles.captionDuration}>
          ({caption.duration.toFixed(1)}s)
        </span>
      </div>
      <div className={captionStyles.captionText}>
        {caption.text.split(/\s+/).filter(Boolean).map((word, i) => (
          <span
            key={i}
            className={captionStyles.captionWord}
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
  onWordClick,
  pauseVideo,
  resumeVideo,
}) {
  const { t } = useTranslation();
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const MAX_RETRIES = 2;
  const listRef = useListRef();
  const scrollTimeoutRef = useRef(null);
  const lastScrolledIndexRef = useRef(-1);
  const setActiveIndex = useActiveCaptionStore((s) => s.setActiveIndex);

  // Sync prop → store so CaptionRow instances subscribe individually
  useEffect(() => {
    setActiveIndex(currentCaptionIndex);
  }, [currentCaptionIndex, setActiveIndex]);

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

      if (!cleanWord || isLookingUp) return;

      setIsLookingUp(true);
      pauseVideo?.();

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
        resumeVideo?.();
      } finally {
        setIsLookingUp(false);
      }
    },
    [captions, getCurrentTime, onWordClick, pauseVideo, resumeVideo, isLookingUp, t],
  );

  const rowProps = useMemo(
    () => ({ parsedCaptions: captions, handleCaptionClick, handleWordClick }),
    [captions, handleCaptionClick, handleWordClick],
  );

  if (loading) {
    return (
      <div className={captionStyles.captionPanel}>
        <div className={captionStyles.captionLoading}>
          <Spinner size={24} />
          <span>{t('player.loadingCaptions')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={captionStyles.captionPanel}>
        <div className={captionStyles.captionError}>
          {retryCount >= MAX_RETRIES ? (
            <p>{t('player.captionsUnavailable')}</p>
          ) : (
            <>
              <p>{t('player.captionsFailed')}</p>
              <button
                onClick={() => { setRetryCount((c) => c + 1); fetchCaptions(); }}
                className={captionStyles.retryButton}
              >
                {t('common.retry')}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!captions.length) {
    return (
      <div className={captionStyles.captionPanel}>
        <div className={captionStyles.captionEmpty}>
          {t('player.noCaptions')}
        </div>
      </div>
    );
  }

  return (
    <div className={`${captionStyles.captionPanel}${isLookingUp ? ` ${captionStyles.captionPanelBusy}` : ""}`}>
      <div className={captionStyles.captionHeader}>
        <h3>{t('player.readerTitle', { defaultValue: 'Reader' })}</h3>
        <p className={captionStyles.captionInfo}>
          {t('player.captionHint')}
        </p>
      </div>

      <List
        listRef={listRef}
        rowComponent={CaptionRow}
        rowCount={captions.length}
        rowHeight={112}
        rowProps={rowProps}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default CaptionPanel;
