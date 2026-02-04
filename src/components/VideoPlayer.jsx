import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import YouTubePlayer from "./YouTubePlayer";
import CaptionPanel from "./CaptionPanel";
import VocabularyPanel from "./VocabularyPanel";
import NotFound from "./NotFound";
import "../styles/VideoPlayer.css";

function VideoPlayer({ videoId }) {
  const navigate = useNavigate();
  // Use ref for raw time (doesn't cause re-renders)
  const currentTimeRef = useRef(0);
  // Only track caption index in state (causes re-render only when caption changes)
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(-1);
  const [playerRef, setPlayerRef] = useState(null);
  const [vocabularyData, setVocabularyData] = useState(null);
  const [isVocabularyPanelOpen, setIsVocabularyPanelOpen] = useState(false);
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

  // Early guard: missing or invalid videoId → show 404 page
  const isMissing = !videoId || videoId === "undefined" || videoId === "null";
  const isInvalidFormat = !/^[a-zA-Z0-9_-]{11}$/.test(videoId || "");
  if (isMissing || isInvalidFormat) {
    return <NotFound />;
  }

  return (
    <div className="video-player-page">
      <nav className="player-nav">
        <button className="back-button" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
        <h2 className="video-title">Video Player</h2>
      </nav>

      <div className="video-player-layout">
        <div className="player-section">
          <YouTubePlayer
            videoId={videoId}
            onTimeUpdate={handleTimeUpdate}
            onPlayerReady={setPlayerRef}
          />
        </div>

        <div className="caption-section">
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
