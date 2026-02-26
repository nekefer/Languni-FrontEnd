import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { resendVerification } from "../api/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

const RESEND_COOLDOWN = 60; // seconds

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
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Languni</div>
        <div style={styles.icon}>✉️</div>
        <h1 style={styles.title}>{t('auth.verifyPending.title')}</h1>
        <p style={styles.subtitle}>
          <Trans
            i18nKey="auth.verifyPending.desc"
            values={{ email: user?.email }}
            components={{ strong: <strong /> }}
          />
        </p>
        <p style={styles.hint}>{t('auth.verifyPending.hint')}</p>

        <button
          style={{
            ...styles.btn,
            ...(cooldown > 0 || sending ? styles.btnDisabled : {}),
          }}
          onClick={handleResend}
          disabled={cooldown > 0 || sending}
        >
          {sending
            ? t('auth.verifyPending.sending')
            : cooldown > 0
            ? t('auth.verifyPending.resendCountdown', { cooldown })
            : t('auth.verifyPending.resend')}
        </button>

        <button style={styles.link} onClick={logout}>
          {t('auth.verifyPending.signOut')}
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f4f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "48px 40px",
    maxWidth: "460px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#4f46e5",
    marginBottom: "24px",
  },
  icon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 12px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.6",
    margin: "0 0 8px",
  },
  hint: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 28px",
  },
  btn: {
    display: "block",
    width: "100%",
    padding: "13px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "12px",
  },
  btnDisabled: {
    background: "#a5b4fc",
    cursor: "not-allowed",
  },
  link: {
    background: "none",
    border: "none",
    color: "#6b7280",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
