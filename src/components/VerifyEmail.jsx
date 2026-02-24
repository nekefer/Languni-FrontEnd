import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { verifyEmail, resendVerification } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const RESEND_COOLDOWN = 60;

export const VerifyEmail = ({ token }) => {
  const { user, checkAuth } = useAuth();
  const [status, setStatus] = useState("loading"); // loading | success | expired | invalid
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const called = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-firing the effect
    if (called.current) return;
    called.current = true;

    if (!token) {
      setStatus("invalid");
      return;
    }
    verifyEmail(token)
      .then(() => {
        setStatus("success");
        // Refresh auth state so ProtectedRoute unblocks immediately
        checkAuth();
      })
      .catch((err) => {
        const code = err.response?.data?.detail?.code;
        setStatus(code === "TOKEN_EXPIRED" ? "expired" : "invalid");
      });
  }, [token]);

  const handleResend = async () => {
    if (cooldown > 0 || sending || !email) return;
    setSending(true);
    try {
      await resendVerification(email);
      toast.success("Verification email sent! Check your inbox.");
      setCooldown(RESEND_COOLDOWN);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (status === "loading") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>Linguini</div>
          <p style={styles.subtitle}>Verifying your email…</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>Linguini</div>
          <div style={styles.icon}>✅</div>
          <h1 style={styles.title}>Email verified!</h1>
          <p style={styles.subtitle}>Your account is now active. You're ready to start learning.</p>
          <Link to="/dashboard" style={styles.btn}>Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>Linguini</div>
          <div style={styles.icon}>⏰</div>
          <h1 style={styles.title}>Link expired</h1>
          <p style={styles.subtitle}>Your verification link has expired. Request a new one below.</p>
          {!user?.email && (
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <button
            style={{ ...styles.btn, ...styles.btnBlock, ...(cooldown > 0 || sending ? styles.btnDisabled : {}) }}
            onClick={handleResend}
            disabled={cooldown > 0 || sending}
          >
            {sending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Linguini</div>
        <div style={styles.icon}>❌</div>
        <h1 style={styles.title}>Invalid link</h1>
        <p style={styles.subtitle}>This verification link is invalid or has already been used.</p>
        <Link to="/verify-email-pending" style={styles.btn}>Back to verification</Link>
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
  logo: { fontSize: "20px", fontWeight: "bold", color: "#4f46e5", marginBottom: "24px" },
  icon: { fontSize: "48px", marginBottom: "16px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 12px" },
  subtitle: { fontSize: "15px", color: "#374151", lineHeight: "1.6", margin: "0 0 24px" },
  input: {
    display: "block",
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    marginBottom: "16px",
    boxSizing: "border-box",
  },
  btn: {
    display: "inline-block",
    padding: "13px 28px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
  },
  btnBlock: { display: "block", width: "100%", boxSizing: "border-box" },
  btnDisabled: { background: "#a5b4fc", cursor: "not-allowed" },
};
