import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { resetPassword } from "../api/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const ResetPassword = ({ token }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ new_password: "", new_password_confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>Languni</div>
          <div style={styles.icon}>❌</div>
          <h1 style={styles.title}>{t('auth.resetPassword.invalidTitle')}</h1>
          <p style={styles.subtitle}>{t('auth.resetPassword.invalidDesc')}</p>
          <Link to="/forgot-password" style={styles.btn}>{t('auth.resetPassword.requestNewLink')}</Link>
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
      setError(t('auth.resetPassword.passwordsMismatch'));
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, form.new_password, form.new_password_confirm);
      toast.success(t('auth.resetPassword.success'));
      navigate({ to: "/login" });
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "TOKEN_EXPIRED") {
        setError(t('auth.resetPassword.expiredError'));
      } else if (code === "INVALID_TOKEN") {
        setError(t('auth.resetPassword.invalidError'));
      } else {
        const detail = err.response?.data?.detail;
        if (typeof detail === "string") {
          setError(detail);
        } else {
          setError(t('auth.resetPassword.genericError'));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Languni</div>
        <h1 style={styles.title}>{t('auth.resetPassword.title')}</h1>
        <p style={styles.subtitle}>{t('auth.resetPassword.subtitle')}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="new_password">{t('auth.resetPassword.newPassword')}</label>
          <input
            id="new_password"
            name="new_password"
            style={styles.input}
            type="password"
            placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
            value={form.new_password}
            onChange={handleChange}
            required
            autoFocus
          />

          <label style={styles.label} htmlFor="new_password_confirm">{t('auth.resetPassword.confirmPassword')}</label>
          <input
            id="new_password_confirm"
            name="new_password_confirm"
            style={styles.input}
            type="password"
            placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
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
            {loading ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submit')}
          </button>
        </form>

        <Link to="/forgot-password" style={styles.backLink}>{t('auth.resetPassword.requestNewLink')}</Link>
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
