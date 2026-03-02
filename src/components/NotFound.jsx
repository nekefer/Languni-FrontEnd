import { useNavigate, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import styles from "../styles/NotFound.module.css";

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>{t('notFound.title')}</h2>
        <p className={styles.errorDescription}>{t('notFound.desc')}</p>

        {location.pathname && (
          <p className={styles.errorPath}>
            <code>{location.pathname}</code>
          </p>
        )}

        <div className={styles.errorActions}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate({ to: "/dashboard" })}
          >
            {t('notFound.backToDashboard')}
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => window.history.back()}
          >
            {t('notFound.goBack')}
          </button>
        </div>

        <div className={styles.errorInfo}>
          <p className={styles.textMuted}>
            {t('notFound.needHelp')}{" "}
            <a href="mailto:support@languni.com">{t('notFound.contactSupport')}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
