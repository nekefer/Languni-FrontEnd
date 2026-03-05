import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Sparkles, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { createCheckout } from "../api/billing";
import config from "../config";
import styles from "../styles/PremiumGate.module.css";

export function PremiumGate({ onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleUpgrade = async () => {
    if (!config.lsMonthlyVariantId) return;
    try {
      setLoading(true);
      const url = await createCheckout(config.lsMonthlyVariantId);
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  const langName = { en: "English", es: "Spanish", fr: "French" }[user?.learning_language] ?? "your language";
  const levelName = user?.level ? user.level.charAt(0).toUpperCase() + user.level.slice(1) : null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className={styles.badge}>
          <Sparkles size={14} />
          Premium
        </div>

        <h2 className={styles.title}>{t("premium.gateTitle")}</h2>
        <p className={styles.subtitle}>
          {levelName
            ? t("premium.gateSubtitleLevel", { lang: langName, level: levelName })
            : t("premium.gateSubtitle", { lang: langName })}
        </p>

        <ul className={styles.benefits}>
          <li><Check size={15} />{t("premium.benefit1")}</li>
          <li><Check size={15} />{t("premium.benefit2")}</li>
          <li><Check size={15} />{t("premium.benefit3")}</li>
          <li><Check size={15} />{t("premium.benefit4")}</li>
        </ul>

        <div className={styles.pricing}>
          <span className={styles.price}>$9<span className={styles.per}>/mo</span></span>
          <span className={styles.yearly}>{t("premium.yearlyNote")}</span>
        </div>

        <button className={styles.upgradeBtn} onClick={handleUpgrade} disabled={loading}>
          {loading ? "..." : t("premium.upgradeBtn")}
        </button>

        <button className={styles.laterBtn} onClick={onClose}>
          {t("premium.laterBtn")}
        </button>
      </div>
    </div>
  );
}
