import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { resendVerification } from "../api/auth";
import styles from "../styles/VerificationBanner.module.css";

const RESEND_COOLDOWN = 60;

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export function VerificationBanner() {
  const { t } = useTranslation();
  const { user, isVerified } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  if (isVerified || dismissed || !user) return null;

  const handleResend = async () => {
    if (cooldown > 0 || sending) return;
    setSending(true);
    try {
      await resendVerification(user.email);
      toast.success(t("auth.verifyPending.resendSuccess"));
      setCooldown(RESEND_COOLDOWN);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error(t("auth.verifyPending.resendFailed"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.banner} role="alert">
      <MailIcon />

      <p className={styles.text}>
        {t("auth.verifyBanner.message")}{" "}
        <strong>{user.email}</strong>
      </p>

      <button
        className={styles.resendBtn}
        onClick={handleResend}
        disabled={cooldown > 0 || sending}
      >
        {sending
          ? t("auth.verifyPending.sending")
          : cooldown > 0
          ? t("auth.verifyPending.resendCountdown", { cooldown })
          : t("auth.verifyPending.resend")}
      </button>

      <button
        className={styles.dismissBtn}
        onClick={() => setDismissed(true)}
        aria-label={t("auth.verifyBanner.dismiss")}
      >
        <CloseIcon />
      </button>
    </div>
  );
}
