import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { resendVerification } from "../api/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import styles from "../styles/auth-card.module.css";
import languni from "../assets/Languni.png";

const RESEND_COOLDOWN = 60;

export const VerifyEmailPending = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    if (cooldown > 0 || sending) return;
    setSending(true);
    try {
      await resendVerification(user?.email);
      toast.success(t('auth.verifyPending.resendSuccess'));
      setCooldown(RESEND_COOLDOWN);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error(t('auth.verifyPending.resendFailed'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.acPage}>
      <div className={styles.acCard}>
        <a href="/" className={styles.acLogo}><img src={languni} alt="Languni" height="36" /></a>
        <span className={styles.acIcon}>✉️</span>
        <h1 className={styles.acTitle}>{t('auth.verifyPending.title')}</h1>
        <p className={styles.acSubtitle}>
          <Trans
            i18nKey="auth.verifyPending.desc"
            values={{ email: user?.email }}
            components={{ strong: <strong /> }}
          />
        </p>
        <p className={styles.acHint}>{t('auth.verifyPending.hint')}</p>

        <button
          className={styles.acBtn}
          onClick={handleResend}
          disabled={cooldown > 0 || sending}
        >
          {sending
            ? t('auth.verifyPending.sending')
            : cooldown > 0
            ? t('auth.verifyPending.resendCountdown', { cooldown })
            : t('auth.verifyPending.resend')}
        </button>

        <hr className={styles.acDivider} />

        <button className={styles.acLinkBtn} onClick={logout}>
          {t('auth.verifyPending.signOut')}
        </button>
      </div>
    </div>
  );
};
