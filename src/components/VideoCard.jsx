import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import savedVideosService from "../api/savedVideos.js";
import { useOptimisticToggle } from "../hooks/useOptimisticToggle.js";
import styles from "../styles/VideoCard.module.css";

const VideoCard = ({ video, onClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { video_id, title, thumbnails, channel_title, published_at } = video;

  const { isSaved, checking, toggle } = useOptimisticToggle({
    id: video_id,
    fetchSaved: () => savedVideosService.isVideoSaved(video_id),
    onSave: async () => {
      await savedVideosService.saveVideo(video_id);
      toast.success(t("videoCard.videoSaved"));
    },
    onUnsave: async () => {
      await savedVideosService.deleteSavedVideo(video_id);
      toast.success(t("videoCard.videoRemoved"));
    },
    onError: (error) => {
      toast.error(error.message || t("videoCard.saveFailed"));
    },
  });

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    toggle();
  };

  const thumbnail =
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("videoCard.today");
    if (diffDays === 1) return t("videoCard.yesterday");
    if (diffDays < 7) return t("videoCard.daysAgo", { count: diffDays });
    if (diffDays < 30) return t("videoCard.weeksAgo", { count: Math.floor(diffDays / 7) });
    if (diffDays < 365) return t("videoCard.monthsAgo", { count: Math.floor(diffDays / 30) });
    return t("videoCard.yearsAgo", { count: Math.floor(diffDays / 365) });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(video);
    } else {
      navigate({ to: `/player/${video_id}` });
    }
  };

  return (
    <div
      className={styles.videoCard}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.videoThumbnail}>
        <img src={thumbnail} alt={title} loading="lazy" />
        <div className={styles.videoDurationOverlay} />
      </div>
      <div className={styles.videoInfo}>
        <div className={styles.videoInfoHeader}>
          <h3 className={styles.videoTitle} title={title}>
            {title}
          </h3>
          <button
            className={`${styles.saveBtn}${isSaved ? ` ${styles.saved}` : ""}`}
            onClick={handleSaveToggle}
            disabled={checking}
            title={isSaved ? t("videoCard.removeFromLibrary") : t("videoCard.saveToLibrary")}
          >
            {checking ? "·" : isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
        <p className={styles.videoChannel}>{channel_title}</p>
        <p className={styles.videoMetadata}>{formatDate(published_at)}</p>
      </div>
    </div>
  );
};

export default VideoCard;
