import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { forgotPassword } from "../api/auth";
import { toast } from "sonner";

export const ForgotPassword = () => {
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
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>Linguini</div>
          <div style={styles.icon}>✉️</div>
          <h1 style={styles.title}>Check your email</h1>
          <p style={styles.subtitle}>
            If <strong>{email}</strong> is linked to a password account, you'll receive a reset link shortly.
          </p>
          <Link to="/login" style={styles.backLink}>Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Linguini</div>
        <h1 style={styles.title}>Forgot password?</h1>
        <p style={styles.subtitle}>Enter your email and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <button style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <Link to="/login" style={styles.backLink}>Back to login</Link>
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
    maxWidth: "420px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  logo: { fontSize: "20px", fontWeight: "bold", color: "#4f46e5", marginBottom: "24px" },
  icon: { fontSize: "48px", marginBottom: "16px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 8px" },
  subtitle: { fontSize: "15px", color: "#374151", lineHeight: "1.6", margin: "0 0 28px" },
  form: { textAlign: "left" },
  label: { display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
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
  },
  btnDisabled: { background: "#a5b4fc", cursor: "not-allowed" },
  backLink: {
    display: "inline-block",
    marginTop: "20px",
    fontSize: "14px",
    color: "#6b7280",
    textDecoration: "none",
  },
};
