import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Flame } from "lucide-react";
import useTrendingStore from "../stores/trendingStore";
import VideoCard from "./VideoCard";
import { Spinner } from "../ui/Spinner";
import styles from "../styles/TrendingPage.module.css";

export function TrendingPage() {
  const { t } = useTranslation();
  const { videos, loading, error, hasMore, region, fetchTrending, loadMore, changeRegion } = useTrendingStore();

  useEffect(() => {
    if (videos.length === 0) {
      fetchTrending({ region, reset: true });
    }
  }, [fetchTrending, region, videos.length]);

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Trending | Languni</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1><Flame size={24} /> {t("dashboard.trendingVideos")}</h1>
          <p className={styles.subtitle}>{t("trending.subtitle")}</p>
        </div>
        <div className={styles.filters}>
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
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>
          {hasMore && (
            <button
              className={styles.loadMoreBtn}
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? <><Spinner size={16} /> {t("dashboard.loading")}</> : t("dashboard.loadMore")}
            </button>
          )}
        </>
      )}
    </div>
  );
}
