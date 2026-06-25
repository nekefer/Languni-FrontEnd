import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Flame, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import useTrendingStore from "../stores/trendingStore";
import { useEffect, useMemo, useState } from "react";
import VideoCard from "./VideoCard";
import { Spinner } from "../ui/Spinner";
import { useCurated } from "../hooks/useCurated";
import {
  GUEST_LANGUAGES,
  getGuestNativeLanguage,
  setGuestNativeLanguage,
} from "../utils/guestPreferences";
import { extractYouTubeVideoId } from "../utils/youtube";
import styles from "../styles/Dashboard.module.css";

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState(() => getGuestNativeLanguage());
  const [trialError, setTrialError] = useState("");
  const videoId = useMemo(() => extractYouTubeVideoId(youtubeUrl), [youtubeUrl]);

  const {
    videos,
    loading,
    error,
    region,
    fetchTrending,
    changeRegion,
  } = useTrendingStore();

  const { videos: curated, loading: curatedLoading, error: curatedError } = useCurated({
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (videos.length === 0) {
      fetchTrending({ region, reset: true });
    }
  }, [fetchTrending, region, videos.length]);

  const handleQuickStart = (event) => {
    event.preventDefault();
    if (!videoId) {
      setTrialError(t("landing.trialInvalid"));
      return;
    }

    setTrialError("");
    setGuestNativeLanguage(nativeLanguage);
    navigate({ to: `/player/${videoId}` });
  };

  return (
    <div className={styles.dashboardContainer}>
      <Helmet>
        <title>Dashboard | Languni</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className={styles.dashboardBody}>
        <div className={styles.dashboardGreeting}>
          <h2>
            {isAuthenticated
              ? t("dashboard.welcome", { name: user?.first_name })
              : t("dashboard.guestWelcome")}
          </h2>
          <p>{isAuthenticated ? user?.email : t("dashboard.guestSubtitle")}</p>
        </div>

        <section className={styles.quickStart}>
          <div className={styles.quickStartCopy}>
            <span>{t("dashboard.quickStartEyebrow")}</span>
            <h3>{t("dashboard.quickStartTitle")}</h3>
          </div>
          <form className={styles.quickStartForm} onSubmit={handleQuickStart}>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder={t("landing.trialPlaceholder")}
              aria-label={t("landing.trialPlaceholder")}
            />
            <select
              value={nativeLanguage}
              onChange={(event) => setNativeLanguage(event.target.value)}
              aria-label={t("landing.nativeLanguageLabel")}
            >
              {GUEST_LANGUAGES.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
            <button type="submit">
              {t("nav.getStarted")} <ArrowRight size={16} />
            </button>
          </form>
          {trialError && <p className={styles.quickStartError}>{trialError}</p>}
        </section>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3><Flame size={18} /> {t("dashboard.trendingVideos")}</h3>
            <div className={styles.sectionHeaderRight}>
              <label className={styles.regionLabel}>
                {t("dashboard.regionLabel")}:
                <select
                  value={region}
                  onChange={(event) => changeRegion(event.target.value)}
                  className={styles.regionSelect}
                >
                  <option value="US">{t("dashboard.regionUS")}</option>
                  <option value="GB">{t("dashboard.regionGB")}</option>
                  <option value="CA">{t("dashboard.regionCA")}</option>
                  <option value="AU">{t("dashboard.regionAU")}</option>
                  <option value="DE">{t("dashboard.regionDE")}</option>
                  <option value="FR">{t("dashboard.regionFR")}</option>
                  <option value="JP">{t("dashboard.regionJP")}</option>
                  <option value="KR">{t("dashboard.regionKR")}</option>
                  <option value="IN">{t("dashboard.regionIN")}</option>
                  <option value="BR">{t("dashboard.regionBR")}</option>
                </select>
              </label>
              <Link to="/trending" className={styles.seeAll}>
                {t("dashboard.seeAll")} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {loading && videos.length === 0 && (
            <div className={styles.loadingMessage}>
              <Spinner size={24} />
              <span>{t("dashboard.loadingTrending")}</span>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}><p>{error}</p></div>
          )}

          {videos.length > 0 && (
            <>
              <div className={styles.videoGrid}>
                {videos.slice(0, 8).map((video) => (
                  <VideoCard key={video.video_id} video={video} />
                ))}
              </div>
              <Link to="/trending" className={styles.viewAllBtn}>
                {t("dashboard.viewAllTrending")} <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        {isAuthenticated ? (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>
                <Sparkles size={18} /> {t("dashboard.forYou")}
              </h3>
            </div>

            {curatedLoading && (
              <div className={styles.loadingMessage}>
                <Spinner size={24} />
                <span>{t("dashboard.loadingForYou")}</span>
              </div>
            )}
            {curatedError && (
              <div className={styles.errorMessage}><p>{curatedError}</p></div>
            )}
            {curated.length > 0 && (
              <div className={styles.videoGrid}>
                {curated.map((video) => (
                  <VideoCard key={video.video_id} video={video} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.guestSavePrompt}>
            <div>
              <span>{t("dashboard.guestPromptEyebrow")}</span>
              <h3>{t("dashboard.guestPromptTitle")}</h3>
              <p>{t("dashboard.guestPromptText")}</p>
            </div>
            <Link to="/register" className={styles.guestPromptButton}>
              {t("auth.register.submit")} <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
