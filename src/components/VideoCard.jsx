import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import savedVideosService from "../api/savedVideos.js";
import "../styles/VideoCard.css";

/**
 * VideoCard Component
 * Displays a single trending video with thumbnail, title, channel, and metadata.
 */
const VideoCard = ({ video, onClick }) => {
  const navigate = useNavigate();
  const { video_id, title, thumbnails, channel_title, published_at } = video;
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (video_id) {
      savedVideosService.isVideoSaved(video_id).then(setIsSaved);
    }
  }, [video_id]);

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      if (isSaved) {
        await savedVideosService.deleteSavedVideo(video_id);
        setIsSaved(false);
        toast.success("Video removed from library");
      } else {
        await savedVideosService.saveVideo(video_id);
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
      setSaving(false);
    }
  };

  // Get the best available thumbnail
  const thumbnail =
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url;

  // Format published date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(video);
    } else {
      // Navigate to player page (prepare for Milestone 3)
      navigate({ to: `/player/${video_id}` });
    }
  };

  return (
    <div
      className="video-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="video-thumbnail">
        <img src={thumbnail} alt={title} loading="lazy" />
        <div className="video-duration-overlay">
          {/* Could add duration here if available */}
        </div>
      </div>
      <div className="video-info">
        <div className="video-info-header">
          <h3 className="video-title" title={title}>
            {title}
          </h3>
          <button
            className={`save-btn${isSaved ? " saved" : ""}`}
            onClick={handleSaveToggle}
            disabled={saving}
            title={isSaved ? "Remove from library" : "Save to library"}
          >
            {saving ? "..." : isSaved ? "\u2605" : "\u2606"}
          </button>
        </div>
        <p className="video-channel">{channel_title}</p>
        <p className="video-metadata">{formatDate(published_at)}</p>
      </div>
    </div>
  );
};

export default VideoCard;
