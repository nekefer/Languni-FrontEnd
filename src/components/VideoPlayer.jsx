import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import YouTubePlayer from "./YouTubePlayer";
import CaptionPanel from "./CaptionPanel";
import VocabularyPanel from "./VocabularyPanel";
import NotFound from "./NotFound";
import "../styles/VideoPlayer.css";

function VideoPlayer({ videoId }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [playerRef, setPlayerRef] = useState(null);
  const [vocabularyData, setVocabularyData] = useState(null);
  const [isVocabularyPanelOpen, setIsVocabularyPanelOpen] = useState(false);

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
            onTimeUpdate={setCurrentTime}
            onPlayerReady={setPlayerRef}
          />
        </div>

        <div className="caption-section">
          <CaptionPanel
            videoId={videoId}
            currentTime={currentTime}
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
