import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { resendVerification } from "../api/auth";
import styles from "../styles/VerificationBanner.module.css";

const RESEND_COOLDOWN = 60;

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
      <span className={styles.icon}>✉️</span>

      <p className={styles.message}>
        {t("auth.verifyBanner.message")}{" "}
        <strong>{user.email}</strong>
      </p>

      <div className={styles.actions}>
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

        <Link to="/verify-email-pending" className={styles.helpLink}>
          {t("auth.verifyBanner.helpLink")}
        </Link>
      </div>

      <button
        className={styles.dismissBtn}
        onClick={() => setDismissed(true)}
        aria-label={t("auth.verifyBanner.dismiss")}
      >
        ✕
      </button>
    </div>
  );
}
