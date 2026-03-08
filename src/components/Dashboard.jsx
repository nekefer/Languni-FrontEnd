import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Flame, Sparkles, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useTrendingStore from "../stores/trendingStore";
import { useEffect } from "react";
import VideoCard from "./VideoCard";
import { PremiumGate } from "./PremiumGate";
import { Spinner } from "../ui/Spinner";
import { useCurated } from "../hooks/useCurated";
import styles from "../styles/Dashboard.module.css";

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user, isPremium } = useAuth();
  const [gateOpen, setGateOpen] = useState(false);

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

  const { videos: curated, loading: curatedLoading, error: curatedError } = useCurated();

  useEffect(() => {
    if (videos.length === 0) {
      fetchTrending({ region, reset: true });
    }
  }, [fetchTrending, region, videos.length]);

  return (
    <div className={styles.dashboardContainer}>
      <Helmet>
        <title>Dashboard | Languni</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className={styles.dashboardBody}>
        <div className={styles.dashboardGreeting}>
          <h2>{t("dashboard.welcome", { name: user.first_name })}</h2>
          <p>{user.email}</p>
        </div>

        {/* ── Trending ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3><Flame size={18} /> {t("dashboard.trendingVideos")}</h3>
            <div className={styles.sectionHeaderRight}>
              <label className={styles.regionLabel}>
                {t("dashboard.regionLabel")}:
                <select
                  value={region}
                  onChange={(e) => changeRegion(e.target.value)}
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

        {/* ── For You ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>
              <Sparkles size={18} /> {t("dashboard.forYou")}
              {!isPremium && <span className={styles.premiumBadge}>Premium</span>}
            </h3>
          </div>

          {isPremium ? (
            <>
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
            </>
          ) : (
            <div className={styles.teaserGrid}>
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={styles.lockedCard}
                  onClick={() => setGateOpen(true)}
                  aria-label={t("premium.unlockForYou")}
                >
                  <div className={styles.lockedThumb}>
                    <Lock size={22} />
                  </div>
                  <div className={styles.lockedInfo}>
                    <span className={styles.lockedBadge}>
                      <Sparkles size={11} /> Premium
                    </span>
                    <span className={styles.lockedLabel}>
                      {t("premium.teaserLabel")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {gateOpen && <PremiumGate onClose={() => setGateOpen(false)} />}
    </div>
  );
};
