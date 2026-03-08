import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { loginUser, googleLogin, fetchUserInfo } from "../api/auth";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { GuestRoute } from "./GuestRoute";
import { Spinner } from "../ui/Spinner";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import styles from "../styles/Login.module.css";
import languni from "../assets/Languni.webp";

export const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const { login } = useAuth();
  const { checkOnboardingStatus } = useOnboarding();

  useEffect(() => {
    if (search?.error) {
      if (search.error === "oauth_failed") {
        setError(t('auth.login.oauthFailed'));
      } else {
        setError(t('auth.login.authFailed'));
      }
    }
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      const userData = await fetchUserInfo();
      setLoading(false);
      login(userData);
      navigate({ to: "/dashboard" });
      toast.success(t('auth.login.success'));
    } catch (err) {
      if (!err.response) {
        const errorMsg = t('common.networkError');
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 401) {
        const errorMsg = t('auth.login.invalidCredentials');
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 422 || err.response?.status === 400) {
        const errorMsg = err.response?.data?.detail || t('auth.login.checkInput');
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 429) {
        const errorMsg = t('auth.login.tooManyAttempts');
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = err.response?.data?.detail || t('auth.login.failed');
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err) {
      toast.error(t('auth.login.googleFailed'));
    }
  };

  return (
    <GuestRoute>
      <Helmet>
        <title>Log In | Languni</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className={styles.loginPage}>
        {/* Left panel — branding */}
        <div className={styles.loginBrand}>
          <div className={styles.loginBrandInner}>
            <a href="/" className={styles.loginLogo}>
              <img src={languni} alt="Languni" width="155" height="40" />
            </a>
            <h1>
              <Trans i18nKey="auth.brandHeading" components={{ em: <em /> }} />
            </h1>
            <p>{t('auth.brandDesc')}</p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className={styles.loginContainer}>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h2 className={styles.loginFormTitle}>{t('auth.login.title')}</h2>
            <p className={styles.loginFormSub}>{t('auth.login.subtitle')}</p>

            {error && <div className={styles.formError}>{error}</div>}

            <div className={styles.loginField}>
              <label className={styles.loginLabel}>{t('auth.login.email')}</label>
              <input
                className={styles.loginInput}
                type="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.loginField}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.loginLabel}>{t('auth.login.password')}</label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => navigate({ to: "/forgot-password" })}
                >
                  {t('auth.login.forgotPassword')}
                </button>
              </div>
              <input
                className={styles.loginInput}
                type="password"
                placeholder={t('auth.login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className={styles.loginSubmit} type="submit" disabled={loading}>
              {loading ? (
                <><Spinner size={16} /> {t('auth.login.submitting')}</>
              ) : (
                t('auth.login.submit')
              )}
            </button>

            <div className={styles.loginDivider}>{t('common.or')}</div>

            <button
              className={styles.loginGoogle}
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              {t('auth.login.google')}
            </button>

            <div className={styles.loginFooter}>
              {t('auth.login.noAccount')}{" "}
              <button
                className={styles.loginFooterLink}
                type="button"
                onClick={() => navigate({ to: "/register" })}
              >
                {t('auth.login.signUp')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GuestRoute>
  );
};
