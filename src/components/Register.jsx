import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { registerUser, googleRegister, fetchUserInfo } from "../api/auth";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { GuestRoute } from "./GuestRoute";
import { useDebounce } from "../hooks/useDebounce";
import { Spinner } from "../ui/Spinner";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import {
  validatePassword,
  validateName,
  validateEmail,
  validatePasswordMatch,
  getPasswordStrengthColor,
  getPasswordStrengthWidth,
} from "../utils/validators";
import styles from "../styles/Register.module.css";

const STRENGTH_KEYS = {
  weak: "auth.register.strengthWeak",
  medium: "auth.register.strengthMedium",
  strong: "auth.register.strengthStrong",
};

export const Register = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const [validation, setValidation] = useState({
    email: { isValid: null, errors: [] },
    first_name: { isValid: null, errors: [] },
    last_name: { isValid: null, errors: [] },
    password: { isValid: null, strength: "none", errors: [] },
    confirmPassword: { isValid: null, errors: [] },
    emailCheckPending: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ from: "/register" });
  const { register } = useAuth();
  const { markAsNewUser } = useOnboarding();

  const debouncedEmail = useDebounce(form.email, 500);
  const debouncedPassword = useDebounce(form.password, 300);
  const debouncedFirstName = useDebounce(form.first_name, 300);
  const debouncedLastName = useDebounce(form.last_name, 300);
  const debouncedConfirmPassword = useDebounce(form.confirmPassword, 300);

  useEffect(() => {
    if (search?.error) {
      setError(search.error === "oauth_failed" ? t('auth.login.oauthFailed') : t('auth.login.authFailed'));
    }
  }, [search]);

  useEffect(() => {
    if (!debouncedEmail) {
      setValidation((prev) => ({ ...prev, email: { isValid: null, errors: [] } }));
      return;
    }
    setValidation((prev) => ({ ...prev, email: { ...validateEmail(debouncedEmail), checkPending: false } }));
  }, [debouncedEmail]);

  useEffect(() => {
    if (!debouncedPassword) {
      setValidation((prev) => ({ ...prev, password: { isValid: null, strength: "none", errors: [] } }));
      return;
    }
    setValidation((prev) => ({ ...prev, password: validatePassword(debouncedPassword) }));
  }, [debouncedPassword]);

  useEffect(() => {
    if (!debouncedFirstName) {
      setValidation((prev) => ({ ...prev, first_name: { isValid: null, errors: [] } }));
      return;
    }
    setValidation((prev) => ({ ...prev, first_name: validateName(debouncedFirstName) }));
  }, [debouncedFirstName]);

  useEffect(() => {
    if (!debouncedLastName) {
      setValidation((prev) => ({ ...prev, last_name: { isValid: null, errors: [] } }));
      return;
    }
    setValidation((prev) => ({ ...prev, last_name: validateName(debouncedLastName) }));
  }, [debouncedLastName]);

  useEffect(() => {
    if (!debouncedConfirmPassword) {
      setValidation((prev) => ({ ...prev, confirmPassword: { isValid: null, errors: [] } }));
      return;
    }
    setValidation((prev) => ({
      ...prev,
      confirmPassword: validatePasswordMatch(debouncedPassword, debouncedConfirmPassword),
    }));
  }, [debouncedConfirmPassword, debouncedPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const isFormValid =
    validation.email.isValid === true &&
    validation.first_name.isValid === true &&
    validation.last_name.isValid === true &&
    validation.password.isValid === true &&
    validation.confirmPassword.isValid === true &&
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { confirmPassword: _confirmPassword, ...registrationData } = form;
      await registerUser(registrationData);
      const userData = await fetchUserInfo();
      register(userData);
      markAsNewUser();
      toast.success(t('auth.register.success'));
      navigate({ to: "/dashboard" });
    } catch (err) {
      if (!err.response) {
        const msg = t('common.networkError'); setError(msg); toast.error(msg);
      } else if (err.response?.status === 409) {
        const msg = t('auth.register.emailTaken'); setError(msg); toast.error(msg);
      } else if (err.response?.status === 422 || err.response?.status === 400) {
        const msg = err.response?.data?.detail || t('auth.register.checkInput'); setError(msg); toast.error(msg);
      } else if (err.response?.status === 429) {
        const msg = t('auth.register.tooManyAttempts'); setError(msg); toast.error(msg);
      } else {
        const msg = err.response?.data?.detail || t('auth.register.failed'); setError(msg); toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try { await googleRegister(); }
    catch (err) { toast.error(t('auth.register.googleFailed')); }
  };

  const checkIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="2,7 5.5,10.5 12,4" />
    </svg>
  );

  return (
    <GuestRoute>
      <div className={styles.registerPage}>
        {/* Left panel — branding */}
        <div className={styles.registerBrand}>
          <div className={styles.registerBrandInner}>
            <a href="/" className={styles.registerLogo}>
              Lang<span>uni</span>
            </a>
            <h1>
              <Trans i18nKey="auth.register.brandHeading" components={{ em: <em /> }} />
            </h1>
            <p>{t('auth.register.brandDesc')}</p>
            <ul className={styles.registerBrandFeatures}>
              <li>{checkIcon}{t('auth.register.brandFeat1')}</li>
              <li>{checkIcon}{t('auth.register.brandFeat2')}</li>
              <li>{checkIcon}{t('auth.register.brandFeat3')}</li>
              <li>{checkIcon}{t('auth.register.brandFeat4')}</li>
            </ul>
          </div>
        </div>

        {/* Right panel — form */}
        <div className={styles.registerContainer}>
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <h2 className={styles.registerFormTitle}>{t('auth.register.title')}</h2>
            <p className={styles.registerFormSub}>{t('auth.register.subtitle')}</p>

            {error && <div className={styles.formError}>{error}</div>}

            {/* Email */}
            <div className={styles.registerField}>
              <label className={styles.registerLabel}>{t('auth.register.email')}</label>
              <input
                className={styles.registerInput}
                name="email"
                type="email"
                placeholder={t('auth.register.emailPlaceholder')}
                value={form.email}
                onChange={handleChange}
                required
              />
              {form.email && validation.email.isValid !== null && (
                <div className={`${styles.registerFeedback} ${validation.email.isValid ? styles.valid : styles.invalid}`}>
                  {validation.email.isValid ? "✓" : "✗"}{" "}
                  {validation.email.errors[0] || t('auth.register.validEmail')}
                </div>
              )}
            </div>

            {/* First & Last Name */}
            <div className={styles.registerRow}>
              <div className={styles.registerField}>
                <label className={styles.registerLabel}>{t('auth.register.firstName')}</label>
                <input
                  className={styles.registerInput}
                  name="first_name"
                  placeholder={t('auth.register.firstNamePlaceholder')}
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
                {form.first_name && validation.first_name.isValid !== null && (
                  <div className={`${styles.registerFeedback} ${validation.first_name.isValid ? styles.valid : styles.invalid}`}>
                    {validation.first_name.isValid ? "✓" : "✗"}{" "}
                    {validation.first_name.errors[0] || t('auth.register.validName')}
                  </div>
                )}
              </div>

              <div className={styles.registerField}>
                <label className={styles.registerLabel}>{t('auth.register.lastName')}</label>
                <input
                  className={styles.registerInput}
                  name="last_name"
                  placeholder={t('auth.register.lastNamePlaceholder')}
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
                {form.last_name && validation.last_name.isValid !== null && (
                  <div className={`${styles.registerFeedback} ${validation.last_name.isValid ? styles.valid : styles.invalid}`}>
                    {validation.last_name.isValid ? "✓" : "✗"}{" "}
                    {validation.last_name.errors[0] || t('auth.register.validName')}
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className={styles.registerField}>
              <label className={styles.registerLabel}>{t('auth.register.password')}</label>
              <input
                className={styles.registerInput}
                name="password"
                type="password"
                placeholder={t('auth.register.passwordPlaceholder')}
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              {form.password && (
                <div className={styles.registerStrength}>
                  <div className={styles.registerStrengthTrack}>
                    <div
                      className={styles.registerStrengthFill}
                      style={{
                        width: `${getPasswordStrengthWidth(validation.password.strength)}%`,
                        backgroundColor: getPasswordStrengthColor(validation.password.strength),
                      }}
                    />
                  </div>
                  <span className={styles.registerStrengthLabel}>
                    {t(STRENGTH_KEYS[validation.password.strength] || '')}
                  </span>
                </div>
              )}
              {form.password && validation.password.errors.length > 0 && (
                <div className={`${styles.registerFeedback} ${styles.invalid}`}>
                  {validation.password.errors.map((err, idx) => (
                    <div key={idx}>✗ {err}</div>
                  ))}
                </div>
              )}
              {form.password && validation.password.isValid === true && (
                <div className={`${styles.registerFeedback} ${styles.valid}`}>
                  ✓ {t('auth.register.passwordValid')}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.registerField}>
              <label className={styles.registerLabel}>{t('auth.register.confirmPassword')}</label>
              <input
                className={styles.registerInput}
                name="confirmPassword"
                type="password"
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {form.confirmPassword && validation.confirmPassword.isValid !== null && (
                <div className={`${styles.registerFeedback} ${validation.confirmPassword.isValid ? styles.valid : styles.invalid}`}>
                  {validation.confirmPassword.isValid ? "✓" : "✗"}{" "}
                  {validation.confirmPassword.errors[0] || t('auth.register.passwordsMatch')}
                </div>
              )}
            </div>

            <button className={styles.registerSubmit} type="submit" disabled={!isFormValid}>
              {loading ? (
                <><Spinner size={16} /> {t('auth.register.submitting')}</>
              ) : (
                t('auth.register.submit')
              )}
            </button>

            <div className={styles.registerDivider}>{t('common.or')}</div>

            <button
              className={styles.registerGoogle}
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              {t('auth.register.google')}
            </button>

            <div className={styles.registerFooter}>
              {t('auth.register.hasAccount')}{" "}
              <button
                className={styles.registerFooterLink}
                type="button"
                onClick={() => navigate({ to: "/login" })}
              >
                {t('auth.register.logIn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GuestRoute>
  );
};
