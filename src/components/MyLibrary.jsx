import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Clapperboard } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import savedVideosService from "../api/savedVideos.js";
import { createLogger } from "../utils/logger";
import { Spinner } from "../ui/Spinner.jsx";
import styles from "../styles/MyLibrary.module.css";

const logger = createLogger("library");

const VIDEOS_PER_PAGE = 12;

const VideoCard = ({ videoData, onDelete, onWatch }) => {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Remove "${videoData.video.title}" from your library?`)) {
      onDelete(videoData.video.youtube_video_id);
    }
  };

  return (
    <div
      className={styles.videoCard}
      onClick={() => onWatch(videoData.video.youtube_video_id)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.thumbnailWrapper}>
        {videoData.video.thumbnail_url ? (
          <img
            src={videoData.video.thumbnail_url}
            alt={videoData.video.title}
            loading="lazy"
          />
        ) : (
          <div className={styles.thumbnailPlaceholder}>{t('library.noThumbnail')}</div>
        )}
      </div>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle} title={videoData.video.title}>
          {videoData.video.title}
        </h3>
        <div className={styles.cardMeta}>
          <span className={styles.saveDate}>
            {t('library.savedOn', { date: formatDate(videoData.saved_at) })}
          </span>
          {videoData.video.language && (
            <span className={styles.languageBadge}>
              {videoData.video.language.toUpperCase()}
            </span>
          )}
        </div>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          title={t('library.removeFromLibrary')}
        >
          {t('library.remove')}
        </button>
      </div>
    </div>
  );
};

const VideoGrid = ({ videos, onDelete, onWatch, loading, error }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <Spinner size={32} />
        <p>{t('library.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <h3>{t('library.errorTitle')}</h3>
        <p>{error}</p>
        <button
          className={styles.btnPrimary}
          onClick={() => window.location.reload()}
        >
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}><Clapperboard size={48} /></div>
        <h3>{t('library.emptyTitle')}</h3>
        <p>{t('library.emptyDesc')}</p>
        <Link to="/dashboard" className={styles.btnPrimary}>
          {t('common.browseVideos')}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.videoGrid}>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          videoData={video}
          onDelete={onDelete}
          onWatch={onWatch}
        />
      ))}
    </div>
  );
};

export const MyLibrary = () => {
  const { t } = useTranslation();
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

  const loadSavedVideos = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const skip = (pageNum - 1) * VIDEOS_PER_PAGE;
      const response = await savedVideosService.getSavedVideos(
        skip,
        VIDEOS_PER_PAGE,
      );

      setSavedVideos(response.videos || []);
      setTotalVideos(response.total || 0);
    } catch (error) {
      logger.error("Failed to load library", error);
      setError(error.message || "Failed to load your library");
      toast.error(t('library.loadFailed'));
      setSavedVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (youtubeVideoId) => {
    try {
      await savedVideosService.deleteSavedVideo(youtubeVideoId);

      const newVideos = savedVideos.filter(
        (v) => v.video.youtube_video_id !== youtubeVideoId,
      );
      setSavedVideos(newVideos);
      setTotalVideos((prev) => prev - 1);

      toast.success(t('library.removed'));

      if (newVideos.length === 0 && page > 1) {
        setPage(page - 1);
      } else {
        loadSavedVideos(page);
      }
    } catch (error) {
      logger.error("Failed to delete video", error);
      toast.error(t('library.removeFailed'));
    }
  };

  const handleWatchVideo = (youtubeVideoId) => {
    navigate({ to: `/player/${youtubeVideoId}` });
  };

  useEffect(() => {
    loadSavedVideos(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className={styles.libraryPage}>
      <div className={styles.libraryHeader}>
        <h3>{t('library.title')}</h3>
        <p className={styles.statsText}>
          {t('library.videosSaved', { count: totalVideos })}
        </p>
      </div>

      <VideoGrid
        videos={savedVideos}
        onDelete={handleDeleteVideo}
        onWatch={handleWatchVideo}
        loading={loading}
        error={error}
      />

      {totalVideos > 0 && (
        <div className={styles.paginationContainer}>
          <button
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
            className={styles.paginationButton}
          >
            {t('library.previous')}
          </button>
          <span className={styles.pageInfo}>
            {t('library.pageInfo', { page, total: totalPages || 1, count: totalVideos })}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages || loading}
            className={styles.paginationButton}
          >
            {t('library.next')}
          </button>
        </div>
      )}
    </div>
  );
};
