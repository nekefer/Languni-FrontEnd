import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { verifyEmail, resendVerification } from "../api/auth";
import { useAuth } from "../contexts/auth-context";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import styles from "../styles/auth-card.module.css";
import languni from "../assets/Languni.webp";

const RESEND_COOLDOWN = 60;

export const VerifyEmail = ({ token }) => {
  const { t } = useTranslation();
  const { user, checkAuth } = useAuth();
  const [status, setStatus] = useState("loading"); // loading | success | expired | invalid
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!token) { setStatus("invalid"); return; }
    verifyEmail(token)
      .then(() => { setStatus("success"); checkAuth(); })
      .catch((err) => {
        const code = err.response?.data?.detail?.code;
        setStatus(code === "TOKEN_EXPIRED" ? "expired" : "invalid");
      });
  }, [token, checkAuth]);

  const handleResend = async () => {
    if (cooldown > 0 || sending || !email) return;
    setSending(true);
    try {
      await resendVerification(email);
      toast.success(t('auth.verifyEmail.resendSuccess'));
      setCooldown(RESEND_COOLDOWN);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error(t('auth.verifyEmail.resendFailed'));
    } finally {
      setSending(false);
    }
  };

  if (status === "loading") {
    return (
      <div className={styles.acPage}>
        <div className={styles.acCard}>
          <a href="/" className={styles.acLogo}><img src={languni} alt="Languni" width="139" height="36" /></a>
          <p className={styles.acSubtitle}>{t('auth.verifyEmail.verifying')}</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={styles.acPage}>
        <div className={styles.acCard}>
          <a href="/" className={styles.acLogo}><img src={languni} alt="Languni" width="139" height="36" /></a>
          <span className={styles.acIcon}>✅</span>
          <h1 className={styles.acTitle}>{t('auth.verifyEmail.successTitle')}</h1>
          <p className={styles.acSubtitle}>{t('auth.verifyEmail.successDesc')}</p>
          <Link to="/dashboard" className={`${styles.acBtn} ${styles.acBtnInline}`}>
            {t('auth.verifyEmail.goToDashboard')}
          </Link>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className={styles.acPage}>
        <div className={styles.acCard}>
          <a href="/" className={styles.acLogo}><img src={languni} alt="Languni" width="139" height="36" /></a>
          <span className={styles.acIcon}>⏰</span>
          <h1 className={styles.acTitle}>{t('auth.verifyEmail.expiredTitle')}</h1>
          <p className={styles.acSubtitle}>{t('auth.verifyEmail.expiredDesc')}</p>
          {!user?.email && (
            <input
              className={styles.acInput}
              type="email"
              placeholder={t('auth.verifyEmail.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <button
            className={styles.acBtn}
            onClick={handleResend}
            disabled={cooldown > 0 || sending}
          >
            {sending
              ? t('auth.verifyEmail.sending')
              : cooldown > 0
              ? t('auth.verifyEmail.resendCountdown', { cooldown })
              : t('auth.verifyEmail.resend')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.acPage}>
      <div className={styles.acCard}>
        <a href="/" className={styles.acLogo}><img src={languni} alt="Languni" width="139" height="36" /></a>
        <span className={styles.acIcon}>❌</span>
        <h1 className={styles.acTitle}>{t('auth.verifyEmail.invalidTitle')}</h1>
        <p className={styles.acSubtitle}>{t('auth.verifyEmail.invalidDesc')}</p>
        <Link to="/verify-email-pending" className={`${styles.acBtn} ${styles.acBtnInline}`}>
          {t('auth.verifyEmail.backToVerification')}
        </Link>
      </div>
    </div>
  );
};
