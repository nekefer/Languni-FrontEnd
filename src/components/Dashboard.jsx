import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { googleLogin } from "../api/auth";
import { getLastLikedVideo } from "../api/youtube";
import preferencesService from "../api/preferences";
import useTrendingStore from "../stores/trendingStore";
import VideoCard from "./VideoCard";
import "../styles/Dashboard.css";

export const Dashboard = () => {
  const { user, logout, isNewUser, clearNewUserFlag } = useAuth();
  const navigate = useNavigate();
  const [lastLikedVideo, setLastLikedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(isNewUser); // Only check if new user

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
    navigate({ to: "/" });
  };

  const fetchLastLikedVideo = async () => {
    try {
      setVideoLoading(true);
      setVideoError(null);
      const video = await getLastLikedVideo();
      setLastLikedVideo(video);
    } catch (error) {
      console.error("Error fetching last liked video:", error);
      setVideoError(
        error.response?.data?.detail || "Failed to fetch last liked video",
      );
    } finally {
      setVideoLoading(false);
    }
  };

  // Check onboarding status ONLY for new users (after registration)
  useEffect(() => {
    const checkOnboarding = async () => {
      // Skip if not a new user - no check needed
      if (!isNewUser) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const completed = await preferencesService.isOnboardingCompleted();
        if (!completed) {
          navigate({ to: "/onboarding" });
          return;
        }
        // Onboarding already completed, clear the flag
        clearNewUserFlag();
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        clearNewUserFlag(); // Clear flag even on error
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [isNewUser, navigate, clearNewUserFlag]);

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
      setVideoError("Please sign in with Google to view your last liked video");
    }
  }, [user]);

  // Show loading while checking onboarding for new users only
  if (checkingOnboarding) {
    return (
      <div className="dashboard-container">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Setting up your account...</p>
        </div>
      </div>
    );
  }

  // If we get here, onboarding is completed

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>Welcome, {user.first_name}!</h2>
          <div className="header-actions">
            <Link to="/my-vocabulary" className="vocabulary-link">
              📚 My Vocabulary
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="user-info">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Name:</strong> {user.first_name} {user.last_name}
        </p>
        {user.auth_method && (
          <p>
            <strong>Auth Method:</strong> {user.auth_method}
          </p>
        )}
      </div>

      {/* Trending Videos Section */}
      <div className="trending-section">
        <div className="trending-header">
          <h3>🔥 Trending Videos</h3>

          <div className="filters">
            <label>
              Region:
              <select
                value={region}
                onChange={(e) => changeRegion(e.target.value)}
                className="region-select"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="GB">🇬🇧 United Kingdom</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="AU">🇦🇺 Australia</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="FR">🇫🇷 France</option>
                <option value="JP">🇯🇵 Japan</option>
                <option value="KR">🇰🇷 South Korea</option>
                <option value="IN">🇮🇳 India</option>
                <option value="BR">🇧🇷 Brazil</option>
              </select>
            </label>
          </div>
        </div>

        {loading && videos.length === 0 && (
          <div className="loading-message">Loading trending videos...</div>
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
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Last Liked Video Section */}
      {(user.auth_method === "google" || user.auth_method === "both") && (
        <div className="video-section">
          <h3>Your Last Liked Video</h3>

          {videoLoading && (
            <div className="loading-message">
              Loading your last liked video...
            </div>
          )}

          {videoError && (
            <div className="error-message">
              <p>{videoError}</p>
              {user.auth_method !== "google" && user.auth_method !== "both" && (
                <button className="google-signin-button" onClick={googleLogin}>
                  Sign in with Google to view YouTube data
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
                    "No description"}
                  ...
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${lastLikedVideo.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-link"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          )}

          {!videoLoading && !videoError && !lastLikedVideo && (
            <p>No liked videos found.</p>
          )}

          {lastLikedVideo && (
            <button className="refresh-button" onClick={fetchLastLikedVideo}>
              Refresh
            </button>
          )}
        </div>
      )}
    </div>
  );
};
