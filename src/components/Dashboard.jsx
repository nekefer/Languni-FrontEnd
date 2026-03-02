import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { googleLogin } from "../api/auth";
import { getLastLikedVideo } from "../api/youtube";
import useTrendingStore from "../stores/trendingStore";
import VideoCard from "./VideoCard";
import { Spinner } from "../ui/Spinner";
import { createLogger } from "../utils/logger";
import styles from "../styles/Dashboard.module.css";

const logger = createLogger("dashboard");

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { resetOnboardingState } = useOnboarding();
  const navigate = useNavigate();
  const [lastLikedVideo, setLastLikedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);

  const {
    videos,
    loading,
    error,
    hasMore,
    region,
    fetchTrending,
    loadMore,
    changeRegion,
  } = useTrendingStore();

  const handleLogout = async () => {
    await logout();
    resetOnboardingState();
    navigate({ to: "/" });
  };

  const fetchLastLikedVideo = async () => {
    try {
      setVideoLoading(true);
      setVideoError(null);
      const video = await getLastLikedVideo();
      setLastLikedVideo(video);
    } catch (error) {
      logger.error("Failed to fetch last liked video", error);
      setVideoError(error.response?.data?.detail || "Failed to fetch last liked video");
    } finally {
      setVideoLoading(false);
    }
  };

  useEffect(() => {
    if (videos.length === 0) {
      fetchTrending({ region, reset: true });
    }
  }, [fetchTrending, region, videos.length]);

  useEffect(() => {
    if (user?.auth_method === "google" || user?.auth_method === "both") {
      fetchLastLikedVideo();
    } else {
      setVideoLoading(false);
      setVideoError(t('dashboard.googleOnly'));
    }
  }, [user]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Top navigation */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <a href="/" className={styles.dashboardLogo}>
            Lang<span>uni</span>
          </a>
          <nav className={styles.headerActions}>
            <Link to="/library" className={styles.vocabularyLink}>
              🎬 {t('dashboard.myLibrary')}
            </Link>
            <Link to="/words" className={styles.vocabularyLink}>
              📚 {t('dashboard.myVocabulary')}
            </Link>
            <button className={styles.logoutButton} onClick={handleLogout}>
              {t('dashboard.logout')}
            </button>
          </nav>
        </div>
      </header>

      {/* Page body */}
      <main className={styles.dashboardBody}>
        <div className={styles.dashboardGreeting}>
          <h2>{t('dashboard.welcome', { name: user.first_name })}</h2>
          <p>{user.email}</p>
        </div>

        {/* Trending Videos */}
        <div className={styles.trendingSection}>
          <div className={styles.trendingHeader}>
            <h3>🔥 {t('dashboard.trendingVideos')}</h3>
            <div className={styles.filters}>
              <label>
                {t('dashboard.regionLabel')}:
                <select
                  value={region}
                  onChange={(e) => changeRegion(e.target.value)}
                  className={styles.regionSelect}
                >
                  <option value="US">🇺🇸 {t('dashboard.regionUS')}</option>
                  <option value="GB">🇬🇧 {t('dashboard.regionGB')}</option>
                  <option value="CA">🇨🇦 {t('dashboard.regionCA')}</option>
                  <option value="AU">🇦🇺 {t('dashboard.regionAU')}</option>
                  <option value="DE">🇩🇪 {t('dashboard.regionDE')}</option>
                  <option value="FR">🇫🇷 {t('dashboard.regionFR')}</option>
                  <option value="JP">🇯🇵 {t('dashboard.regionJP')}</option>
                  <option value="KR">🇰🇷 {t('dashboard.regionKR')}</option>
                  <option value="IN">🇮🇳 {t('dashboard.regionIN')}</option>
                  <option value="BR">🇧🇷 {t('dashboard.regionBR')}</option>
                </select>
              </label>
            </div>
          </div>

          {loading && videos.length === 0 && (
            <div className={styles.loadingMessage}>
              <Spinner size={24} />
              <span>{t('dashboard.loadingTrending')}</span>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {videos.length > 0 && (
            <>
              <div className={styles.videoGrid}>
                {videos.map((video) => (
                  <VideoCard key={video.video_id} video={video} />
                ))}
              </div>
              {hasMore && (
                <button
                  className={styles.loadMoreButton}
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <><Spinner size={16} /> {t('dashboard.loading')}</>
                  ) : (
                    t('dashboard.loadMore')
                  )}
                </button>
              )}
            </>
          )}
        </div>

        {/* Last Liked Video (Google users only) */}
        {(user.auth_method === "google" || user.auth_method === "both") && (
          <div className={styles.videoSection}>
            <h3>{t('dashboard.lastLikedVideo')}</h3>

            {videoLoading && (
              <div className={styles.loadingMessage}>
                <Spinner size={24} />
                <span>{t('dashboard.loadingLastLiked')}</span>
              </div>
            )}

            {videoError && (
              <div className={styles.errorMessage}>
                <p>{videoError}</p>
                {user.auth_method !== "google" && user.auth_method !== "both" && (
                  <button className={styles.googleSigninButton} onClick={googleLogin}>
                    {t('dashboard.signInForYouTube')}
                  </button>
                )}
              </div>
            )}

            {lastLikedVideo && (
              <div className={styles.videoContent}>
                {lastLikedVideo.thumbnails?.medium?.url && (
                  <img
                    src={lastLikedVideo.thumbnails.medium.url}
                    alt={lastLikedVideo.title}
                    className={styles.videoThumbnail}
                  />
                )}
                <div className={styles.videoDetails}>
                  <h4>{lastLikedVideo.title}</h4>
                  <p className={styles.videoDescription}>
                    {lastLikedVideo.description?.substring(0, 200) ?? t('dashboard.noDescription')}...
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${lastLikedVideo.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.youtubeLink}
                  >
                    ▶ {t('dashboard.watchOnYouTube')}
                  </a>
                </div>
              </div>
            )}

            {!videoLoading && !videoError && !lastLikedVideo && (
              <p className={styles.emptyText}>{t('dashboard.noLikedVideos')}</p>
            )}

            {lastLikedVideo && (
              <button className={styles.refreshButton} onClick={fetchLastLikedVideo}>
                ↻ {t('dashboard.refresh')}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
