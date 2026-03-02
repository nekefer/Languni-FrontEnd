import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { forgotPassword } from "../api/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import styles from "../styles/auth-card.module.css";

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch {
      toast.error(t('auth.forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.acPage}>
        <div className={styles.acCard}>
          <a href="/" className={styles.acLogo}>Lang<span>uni</span></a>
          <span className={styles.acIcon}>✉️</span>
          <h1 className={styles.acTitle}>{t('auth.forgotPassword.checkEmailTitle')}</h1>
          <p className={styles.acSubtitle}>
            <Trans
              i18nKey="auth.forgotPassword.checkEmailDesc"
              values={{ email }}
              components={{ strong: <strong /> }}
            />
          </p>
          <Link to="/login" className={`${styles.acBtn} ${styles.acBtnInline}`}>
            {t('auth.forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.acPage}>
      <div className={styles.acCard}>
        <a href="/" className={styles.acLogo}>Lang<span>uni</span></a>
        <h1 className={styles.acTitle}>{t('auth.forgotPassword.title')}</h1>
        <p className={styles.acSubtitle}>{t('auth.forgotPassword.subtitle')}</p>

        <form onSubmit={handleSubmit} className={styles.acForm}>
          <label className={styles.acLabel} htmlFor="fp-email">
            {t('auth.forgotPassword.email')}
          </label>
          <input
            id="fp-email"
            className={styles.acInput}
            type="email"
            placeholder={t('auth.forgotPassword.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <button className={styles.acBtn} type="submit" disabled={loading}>
            {loading ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submit')}
          </button>
        </form>

        <Link to="/login" className={styles.acBackLink}>
          {t('auth.forgotPassword.backToLogin')}
        </Link>
      </div>
    </div>
  );
};
