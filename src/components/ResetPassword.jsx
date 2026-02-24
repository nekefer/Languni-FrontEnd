import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { resetPassword } from "../api/auth";
import { toast } from "sonner";

export const ResetPassword = ({ token }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ new_password: "", new_password_confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>Linguini</div>
          <div style={styles.icon}>❌</div>
          <h1 style={styles.title}>Invalid link</h1>
          <p style={styles.subtitle}>This reset link is invalid or has already been used.</p>
          <Link to="/forgot-password" style={styles.btn}>Request a new link</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.new_password_confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, form.new_password, form.new_password_confirm);
      toast.success("Password reset successfully!");
      navigate({ to: "/login" });
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "TOKEN_EXPIRED") {
        setError("This reset link has expired. Please request a new one.");
      } else if (code === "INVALID_TOKEN") {
        setError("Invalid reset link.");
      } else {
        const detail = err.response?.data?.detail;
        if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Linguini</div>
        <h1 style={styles.title}>Reset your password</h1>
        <p style={styles.subtitle}>Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="new_password">New password</label>
          <input
            id="new_password"
            name="new_password"
            style={styles.input}
            type="password"
            placeholder="At least 8 characters"
            value={form.new_password}
            onChange={handleChange}
            required
            autoFocus
          />

          <label style={styles.label} htmlFor="new_password_confirm">Confirm new password</label>
          <input
            id="new_password_confirm"
            name="new_password_confirm"
            style={styles.input}
            type="password"
            placeholder="Repeat your new password"
            value={form.new_password_confirm}
            onChange={handleChange}
            required
          />

          {error && <p style={styles.errorText}>{error}</p>}

          <button
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <Link to="/forgot-password" style={styles.backLink}>Request a new link</Link>
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
  errorText: { color: "#dc2626", fontSize: "13px", margin: "-8px 0 12px" },
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
    textDecoration: "none",
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
