import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCurated } from "../hooks/useCurated";
import VideoCard from "./VideoCard";
import { PremiumGate } from "./PremiumGate";
import { Spinner } from "../ui/Spinner";
import styles from "../styles/RecommendedPage.module.css";

export function RecommendedPage() {
  const { t } = useTranslation();
  const { isPremium, user } = useAuth();
  const [gateOpen, setGateOpen] = useState(!isPremium);
  const { videos, loading, error } = useCurated();

  const langName = { en: "English", es: "Spanish", fr: "French" }[user?.learning_language] ?? "your language";

  if (!isPremium) {
    return (
      <div className={styles.page}>
        <Helmet>
          <title>For You | Languni</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <div className={styles.lockedPage}>
          <Sparkles size={40} className={styles.lockedIcon} />
          <h2>{t("premium.gateTitle")}</h2>
          <p>{t("premium.gateSubtitle", { lang: langName })}</p>
          <button className={styles.upgradeBtn} onClick={() => setGateOpen(true)}>
            {t("premium.upgradeBtn")}
          </button>
        </div>
        {gateOpen && <PremiumGate onClose={() => setGateOpen(false)} />}
      </div>
    );
  }

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
