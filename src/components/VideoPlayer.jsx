import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import YouTubePlayer from "./YouTubePlayer";
import CaptionPanel from "./CaptionPanel";
import VocabularyPanel from "./VocabularyPanel";
import NotFound from "./NotFound";
import savedVideosService from "../api/savedVideos.js";
import styles from "../styles/VideoPlayer.module.css";

function VideoPlayer({ videoId }) {
  const navigate = useNavigate();
  // Use ref for raw time (doesn't cause re-renders)
  const currentTimeRef = useRef(0);
  // Only track caption index in state (causes re-render only when caption changes)
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(-1);
  const [playerRef, setPlayerRef] = useState(null);
  const [vocabularyData, setVocabularyData] = useState(null);
  const [isVocabularyPanelOpen, setIsVocabularyPanelOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  // Store captions reference for index calculation
  const captionsRef = useRef([]);

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
    // Handle word click from CaptionPanel
    // Pause video when vocabulary panel opens
    // Added optional chaining to avoid errors if playerRef is null
    // because we can get the captions before the player is ready
    // the user can still click on words before the video loads
    playerRef?.pauseVideo();
    setVocabularyData(vocabularyData);
    setIsVocabularyPanelOpen(true);
  };

  const handleCloseVocabularyPanel = () => {
    setIsVocabularyPanelOpen(false);
    setVocabularyData(null);
  };

  const handleBackToDashboard = () => {
    navigate({ to: "/dashboard" });
  };

  useEffect(() => {
    if (videoId) {
      savedVideosService.isVideoSaved(videoId).then(setIsSaved);
    }
  }, [videoId]);

  const handleSaveToggle = async () => {
    if (savingVideo) return;
    setSavingVideo(true);
    try {
      if (isSaved) {
        await savedVideosService.deleteSavedVideo(videoId);
        setIsSaved(false);
        toast.success("Video removed from library");
      } else {
        await savedVideosService.saveVideo(videoId);
        setIsSaved(true);
        toast.success("Video saved to library");
      }
    } catch (error) {
      if (error.message?.includes("already saved")) {
        setIsSaved(true);
      } else {
        toast.error(error.message || "Failed to update library");
      }
    } finally {
      setSavingVideo(false);
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
          ← Back
        </button>
        <h2 className={styles.videoTitle}>Video Player</h2>
        <button
          className={`${styles.playerSaveBtn}${isSaved ? ` ${styles.saved}` : ""}`}
          onClick={handleSaveToggle}
          disabled={savingVideo}
        >
          {savingVideo ? "..." : isSaved ? "\u2605 Saved" : "\u2606 Save"}
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
