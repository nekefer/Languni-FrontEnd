import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { resetPassword } from "../api/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import styles from "../styles/auth-card.module.css";
import languni from "../assets/Languni.webp";

export const ResetPassword = ({ token }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ new_password: "", new_password_confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className={styles.acPage}>
        <div className={styles.acCard}>
          <a href="/" className={styles.acLogo}><img src={languni} alt="Languni" width="139" height="36" /></a>
          <span className={styles.acIcon}>❌</span>
          <h1 className={styles.acTitle}>{t('auth.resetPassword.invalidTitle')}</h1>
          <p className={styles.acSubtitle}>{t('auth.resetPassword.invalidDesc')}</p>
          <Link to="/forgot-password" className={`${styles.acBtn} ${styles.acBtnInline}`}>
            {t('auth.resetPassword.requestNewLink')}
          </Link>
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
        setError(typeof detail === "string" ? detail : t('auth.resetPassword.genericError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.acPage}>
      <div className={styles.acCard}>
        <a href="/" className={styles.acLogo}><img src={languni} alt="Languni" width="139" height="36" /></a>
        <h1 className={styles.acTitle}>{t('auth.resetPassword.title')}</h1>
        <p className={styles.acSubtitle}>{t('auth.resetPassword.subtitle')}</p>

        <form onSubmit={handleSubmit} className={styles.acForm}>
          <label className={styles.acLabel} htmlFor="rp-new">
            {t('auth.resetPassword.newPassword')}
          </label>
          <input
            id="rp-new"
            name="new_password"
            className={styles.acInput}
            type="password"
            placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
            value={form.new_password}
            onChange={handleChange}
            required
            autoFocus
          />

          <label className={styles.acLabel} htmlFor="rp-confirm">
            {t('auth.resetPassword.confirmPassword')}
          </label>
          <input
            id="rp-confirm"
            name="new_password_confirm"
            className={styles.acInput}
            type="password"
            placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
            value={form.new_password_confirm}
            onChange={handleChange}
            required
          />

          {error && <p className={styles.acError}>{error}</p>}

          <button className={styles.acBtn} type="submit" disabled={loading}>
            {loading ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submit')}
          </button>
        </form>

        <Link to="/forgot-password" className={styles.acBackLink}>
          {t('auth.resetPassword.requestNewLink')}
        </Link>
      </div>
    </div>
  );
};
