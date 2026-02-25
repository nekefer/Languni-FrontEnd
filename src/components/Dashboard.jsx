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
import "../styles/Dashboard.css";

const logger = createLogger("dashboard");

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { resetOnboardingState } = useOnboarding();
  const navigate = useNavigate();
  const [lastLikedVideo, setLastLikedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);

  // Trending videos from Zustand store (with region persistence)
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
      setVideoError(
        error.response?.data?.detail || "Failed to fetch last liked video",
      );
    } finally {
      setVideoLoading(false);
    }
  };

  useEffect(() => {
    // Fetch trending videos on mount only if we don't have videos
    // This preserves region and videos when navigating back
    if (videos.length === 0) {
      fetchTrending({ region, reset: true });
    }
  }, [fetchTrending, region, videos.length]);

  useEffect(() => {
    // Only fetch if user is authenticated with Google
    if (
      user &&
      user.auth_method &&
      (user.auth_method === "google" || user.auth_method === "both")
    ) {
      fetchLastLikedVideo();
    } else {
      setVideoLoading(false);
      setVideoError(t('dashboard.googleOnly'));
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>{t('dashboard.welcome', { name: user.first_name })}</h2>
          <div className="header-actions">
            <Link to="/library" className="vocabulary-link">
              🎬 {t('dashboard.myLibrary')}
            </Link>
            <Link to="/words" className="vocabulary-link">
              📚 {t('dashboard.myVocabulary')}
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              {t('dashboard.logout')}
            </button>
          </div>
        </div>
      </div>

      <div className="user-info">
        <p>
          <strong>{t('dashboard.emailLabel')}:</strong> {user.email}
        </p>
        <p>
          <strong>{t('dashboard.nameLabel')}:</strong> {user.first_name} {user.last_name}
        </p>
        {user.auth_method && (
          <p>
            <strong>{t('dashboard.authMethodLabel')}:</strong> {user.auth_method}
          </p>
        )}
      </div>

      {/* Trending Videos Section */}
      <div className="trending-section">
        <div className="trending-header">
          <h3>🔥 {t('dashboard.trendingVideos')}</h3>

          <div className="filters">
            <label>
              {t('dashboard.regionLabel')}:
              <select
                value={region}
                onChange={(e) => changeRegion(e.target.value)}
                className="region-select"
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
          <div className="loading-message">
            <Spinner size={24} />
            <span>{t('dashboard.loadingTrending')}</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {videos.length > 0 && (
          <>
            <div className="video-grid">
              {videos.map((video) => (
                <VideoCard key={video.video_id} video={video} />
              ))}
            </div>

            {hasMore && (
              <button
                className="load-more-button"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size={16} /> {t('dashboard.loading')}
                  </>
                ) : (
                  t('dashboard.loadMore')
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Last Liked Video Section */}
      {(user.auth_method === "google" || user.auth_method === "both") && (
        <div className="video-section">
          <h3>{t('dashboard.lastLikedVideo')}</h3>

          {videoLoading && (
            <div className="loading-message">
              <Spinner size={24} />
              <span>{t('dashboard.loadingLastLiked')}</span>
            </div>
          )}

          {videoError && (
            <div className="error-message">
              <p>{videoError}</p>
              {user.auth_method !== "google" && user.auth_method !== "both" && (
                <button className="google-signin-button" onClick={googleLogin}>
                  {t('dashboard.signInForYouTube')}
                </button>
              )}
            </div>
          )}

          {lastLikedVideo && (
            <div className="video-content">
              {lastLikedVideo.thumbnails?.medium?.url && (
                <img
                  src={lastLikedVideo.thumbnails.medium.url}
                  alt={lastLikedVideo.title}
                  className="video-thumbnail"
                />
              )}
              <div className="video-details">
                <h4>{lastLikedVideo.title}</h4>
                <p className="video-description">
                  {lastLikedVideo.description?.substring(0, 200) ??
                    t('dashboard.noDescription')}
                  ...
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${lastLikedVideo.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-link"
                >
                  {t('dashboard.watchOnYouTube')}
                </a>
              </div>
            </div>
          )}

          {!videoLoading && !videoError && !lastLikedVideo && (
            <p>{t('dashboard.noLikedVideos')}</p>
          )}

          {lastLikedVideo && (
            <button className="refresh-button" onClick={fetchLastLikedVideo}>
              {t('dashboard.refresh')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
