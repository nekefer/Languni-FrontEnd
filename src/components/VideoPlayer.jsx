import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import posthog from "posthog-js";
import { ArrowLeft, Bookmark, BookmarkCheck, Home } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/auth-context";
import YouTubePlayer from "./YouTubePlayer";
import CaptionPanel from "./CaptionPanel";
import VocabularyPanel from "./VocabularyPanel";
import NotFound from "./NotFound";
import savedVideosService from "../api/savedVideos.js";
import videosService from "../api/videos.js";
import { useOptimisticToggle } from "../hooks/useOptimisticToggle.js";
import styles from "../styles/VideoPlayer.module.css";

function VideoPlayer({ videoId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  // Use ref for raw time (doesn't cause re-renders)
  const currentTimeRef = useRef(0);
  // Only track caption index in state (causes re-render only when caption changes)
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(-1);
  const [playerRef, setPlayerRef] = useState(null);
  const [vocabularyData, setVocabularyData] = useState(null);
  const [isVocabularyPanelOpen, setIsVocabularyPanelOpen] = useState(false);
  // Store captions reference for index calculation
  const captionsRef = useRef([]);

  useEffect(() => {
    posthog.capture("video_opened", { video_id: videoId });
    if (isAuthenticated) {
      videosService.startWatching(videoId).catch(() => {});
    }
  }, [videoId, isAuthenticated]);

  const { isSaved, checking, toggle: toggleSave } = useOptimisticToggle({
    id: videoId,
    fetchSaved: () => isAuthenticated
      ? savedVideosService.isVideoSaved(videoId)
      : Promise.resolve(false),
    onSave: async () => {
      if (!isAuthenticated) {
        toast.info(t("player.loginToSave"));
        navigate({ to: "/register" });
        return;
      }
      await savedVideosService.saveVideo(videoId);
      posthog.capture("video_saved", { video_id: videoId, source: "player" });
      toast.success(t("videoCard.videoSaved"));
    },
    onUnsave: async () => {
      if (!isAuthenticated) {
        return;
      }
      await savedVideosService.deleteSavedVideo(videoId);
      posthog.capture("video_unsaved", { video_id: videoId, source: "player" });
      toast.success(t("videoCard.videoRemoved"));
    },
    onError: (error) => {
      toast.error(error.message || t("videoCard.saveFailed"));
    },
  });

  // Calculate caption index from time
  const calculateCaptionIndex = useCallback((time, captions) => {
    if (!captions.length) return -1;
    const bufferTime = 0.2;
    const adjustedTime = time + bufferTime;

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
  }, []);

  // Handle time updates - only update state when caption changes
  const handleTimeUpdate = useCallback((time) => {
    currentTimeRef.current = time;
    const newIndex = calculateCaptionIndex(time, captionsRef.current);
    // Only update state if caption index changed
    setCurrentCaptionIndex((prevIndex) => {
      if (prevIndex !== newIndex) {
        return newIndex;
      }
      return prevIndex;
    });
  }, [calculateCaptionIndex]);

  // Callback for CaptionPanel to register captions
  const handleCaptionsLoaded = useCallback((captions) => {
    captionsRef.current = captions;
  }, []);

  // Getter for current time (used by CaptionPanel for word click)
  const getCurrentTime = useCallback(() => currentTimeRef.current, []);

  const handleSeek = (time) => {
    // Seek YouTube player to specific time
    if (playerRef && playerRef.seekTo) {
      playerRef.seekTo(time);
    }
  };

  const handleWordClick = (vocabularyData) => {
    posthog.capture("word_clicked", { word: vocabularyData.word, video_id: videoId });
    setVocabularyData(vocabularyData);
    setIsVocabularyPanelOpen(true);
  };

  const handleCloseVocabularyPanel = () => {
    setIsVocabularyPanelOpen(false);
    setVocabularyData(null);
    playerRef?.playVideo();
  };

  const handleBackToDashboard = () => {
    if (!isAuthenticated) {
      navigate({ to: "/dashboard" });
      return;
    }

    if (router.history.length > 1) {
      router.history.back();
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  // Early guard: missing or invalid videoId → show 404 page
  const isMissing = !videoId || videoId === "undefined" || videoId === "null";
  const isInvalidFormat = !/^[a-zA-Z0-9_-]{11}$/.test(videoId || "");
  if (isMissing || isInvalidFormat) {
    return <NotFound />;
  }

  return (
    <div className={styles.videoPlayerPage}>
      <nav className={styles.playerNav}>
        <button className={styles.backButton} onClick={handleBackToDashboard}>
          {isAuthenticated
            ? <><ArrowLeft size={15} /> {t('player.back')}</>
            : <><Home size={15} /> {t('player.home')}</>
          }
        </button>
        <h2 className={styles.videoTitle}>Video Player</h2>
        <button
          className={`${styles.playerSaveBtn}${isSaved ? ` ${styles.saved}` : ""}`}
          onClick={toggleSave}
          disabled={checking}
        >
          {checking ? "···" : isSaved
            ? <><BookmarkCheck size={15} /> {t('player.saved')}</>
            : <><Bookmark size={15} /> {t('player.save')}</>
          }
        </button>
      </nav>

      <div className={styles.videoPlayerLayout}>
        <div className={styles.playerSection}>
          <YouTubePlayer
            videoId={videoId}
            onTimeUpdate={handleTimeUpdate}
            onPlayerReady={setPlayerRef}
          />
        </div>

        <div className={styles.captionSection}>
          <CaptionPanel
            videoId={videoId}
            currentCaptionIndex={currentCaptionIndex}
            getCurrentTime={getCurrentTime}
            onCaptionsLoaded={handleCaptionsLoaded}
            onSeek={handleSeek}
            onWordClick={handleWordClick}
            pauseVideo={() => playerRef?.pauseVideo()}
            resumeVideo={() => playerRef?.playVideo()}
          />
        </div>
      </div>

      {/* Vocabulary Panel */}
      <VocabularyPanel
        vocabularyData={vocabularyData}
        videoId={videoId}
        isOpen={isVocabularyPanelOpen}
        onClose={handleCloseVocabularyPanel}
      />
    </div>
  );
}

export default VideoPlayer;
