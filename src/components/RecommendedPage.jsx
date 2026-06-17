import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { useCurated } from "../hooks/useCurated";
import VideoCard from "./VideoCard";
import { Spinner } from "../ui/Spinner";
import styles from "../styles/RecommendedPage.module.css";

export function RecommendedPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { videos, loading, error } = useCurated();

  const langName = { en: "English", es: "Spanish", fr: "French" }[user?.learning_language] ?? "your language";

  return (
    <div className={styles.page}>
      <Helmet>
        <title>For You | Languni</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className={styles.header}>
        <div>
          <h1><Sparkles size={22} /> {t("nav.appForYou")}</h1>
          <p className={styles.subtitle}>{t("recommended.subtitle", { lang: langName })}</p>
        </div>
        <span className={styles.refreshNote}>
          <RefreshCw size={13} /> {t("recommended.refreshNote")}
        </span>
      </div>

      {loading && (
        <div className={styles.loadingMessage}>
          <Spinner size={24} />
          <span>{t("dashboard.loadingForYou")}</span>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}><p>{error}</p></div>
      )}

      {!loading && videos.length > 0 && (
        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <VideoCard key={video.video_id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
