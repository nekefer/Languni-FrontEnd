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
import "../styles/Register.css";

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

  // Real-time validation states
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

  // Debounce form values for validation
  const debouncedEmail = useDebounce(form.email, 500);
  const debouncedPassword = useDebounce(form.password, 300);
  const debouncedFirstName = useDebounce(form.first_name, 300);
  const debouncedLastName = useDebounce(form.last_name, 300);
  const debouncedConfirmPassword = useDebounce(form.confirmPassword, 300);

  // Handle error messages from URL params
  useEffect(() => {
    if (search?.error) {
      if (search.error === "oauth_failed") {
        setError(t('auth.login.oauthFailed'));
      } else {
        setError(t('auth.login.authFailed'));
      }
    }
  }, [search]);

  // Real-time email validation
  useEffect(() => {
    if (!debouncedEmail) {
      setValidation((prev) => ({
        ...prev,
        email: { isValid: null, errors: [] },
      }));
      return;
    }

    const emailValidation = validateEmail(debouncedEmail);
    setValidation((prev) => ({
      ...prev,
      email: { ...emailValidation, checkPending: false },
    }));
  }, [debouncedEmail]);

  // Real-time password validation
  useEffect(() => {
    if (!debouncedPassword) {
      setValidation((prev) => ({
        ...prev,
        password: { isValid: null, strength: "none", errors: [] },
      }));
      return;
    }

    const passwordValidation = validatePassword(debouncedPassword);
    setValidation((prev) => ({
      ...prev,
      password: passwordValidation,
    }));
  }, [debouncedPassword]);

  // Real-time first name validation
  useEffect(() => {
    if (!debouncedFirstName) {
      setValidation((prev) => ({
        ...prev,
        first_name: { isValid: null, errors: [] },
      }));
      return;
    }

    const nameValidation = validateName(debouncedFirstName);
    setValidation((prev) => ({
      ...prev,
      first_name: nameValidation,
    }));
  }, [debouncedFirstName]);

  // Real-time last name validation
  useEffect(() => {
    if (!debouncedLastName) {
      setValidation((prev) => ({
        ...prev,
        last_name: { isValid: null, errors: [] },
      }));
      return;
    }

    const nameValidation = validateName(debouncedLastName);
    setValidation((prev) => ({
      ...prev,
      last_name: nameValidation,
    }));
  }, [debouncedLastName]);

  // Real-time password match validation
  useEffect(() => {
    if (!debouncedConfirmPassword) {
      setValidation((prev) => ({
        ...prev,
        confirmPassword: { isValid: null, errors: [] },
      }));
      return;
    }

    const matchValidation = validatePasswordMatch(
      debouncedPassword,
      debouncedConfirmPassword,
    );
    setValidation((prev) => ({
      ...prev,
      confirmPassword: matchValidation,
    }));
  }, [debouncedConfirmPassword, debouncedPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Check if form is valid for submission
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
      markAsNewUser(); // Mark as new user for onboarding

      toast.success(t('auth.register.success'));
      navigate({ to: "/dashboard" });
    } catch (err) {
      if (!err.response) {
        const errorMsg = t('common.networkError');
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 409) {
        const errorMsg = t('auth.register.emailTaken');
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 422 || err.response?.status === 400) {
        const errorMsg =
          err.response?.data?.detail || t('auth.register.checkInput');
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 429) {
        const errorMsg = t('auth.register.tooManyAttempts');
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg =
          err.response?.data?.detail ||
          t('auth.register.failed');
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await googleRegister();
    } catch (err) {
      toast.error(t('auth.register.googleFailed'));
    }
  };

  const checkIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="2,7 5.5,10.5 12,4" />
    </svg>
  );

  return (
    <GuestRoute>
      <div className="register-page">
        {/* Left panel — branding */}
        <div className="register-brand">
          <div className="register-brand-inner">
            <a href="/" className="register-logo">
              Lingu<span>ini</span>
            </a>
            <h1>
              <Trans i18nKey="auth.register.brandHeading" components={{ em: <em /> }} />
            </h1>
            <p>{t('auth.register.brandDesc')}</p>
            <ul className="register-brand-features">
              <li>
                {checkIcon}
                {t('auth.register.brandFeat1')}
              </li>
              <li>
                {checkIcon}
                {t('auth.register.brandFeat2')}
              </li>
              <li>
                {checkIcon}
                {t('auth.register.brandFeat3')}
              </li>
              <li>
                {checkIcon}
                {t('auth.register.brandFeat4')}
              </li>
            </ul>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="register-container">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2 className="register-form-title">{t('auth.register.title')}</h2>
            <p className="register-form-sub">
              {t('auth.register.subtitle')}
            </p>

            {error && <div className="error">{error}</div>}

            {/* Email */}
            <div className="register-field">
              <label className="register-label">{t('auth.register.email')}</label>
              <input
                className="register-input"
                name="email"
                type="email"
                placeholder={t('auth.register.emailPlaceholder')}
                value={form.email}
                onChange={handleChange}
                required
              />
              {form.email && validation.email.isValid !== null && (
                <div
                  className={`register-feedback ${
                    validation.email.isValid ? "valid" : "invalid"
                  }`}
                >
                  {validation.email.isValid ? "\u2713" : "\u2717"}{" "}
                  {validation.email.errors[0] || t('auth.register.validEmail')}
                </div>
              )}
            </div>

            {/* First & Last Name — side by side */}
            <div className="register-row">
              <div className="register-field">
                <label className="register-label">{t('auth.register.firstName')}</label>
                <input
                  className="register-input"
                  name="first_name"
                  placeholder={t('auth.register.firstNamePlaceholder')}
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
                {form.first_name && validation.first_name.isValid !== null && (
                  <div
                    className={`register-feedback ${
                      validation.first_name.isValid ? "valid" : "invalid"
                    }`}
                  >
                    {validation.first_name.isValid ? "\u2713" : "\u2717"}{" "}
                    {validation.first_name.errors[0] || t('auth.register.validName')}
                  </div>
                )}
              </div>

              <div className="register-field">
                <label className="register-label">{t('auth.register.lastName')}</label>
                <input
                  className="register-input"
                  name="last_name"
                  placeholder={t('auth.register.lastNamePlaceholder')}
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
                {form.last_name && validation.last_name.isValid !== null && (
                  <div
                    className={`register-feedback ${
                      validation.last_name.isValid ? "valid" : "invalid"
                    }`}
                  >
                    {validation.last_name.isValid ? "\u2713" : "\u2717"}{" "}
                    {validation.last_name.errors[0] || t('auth.register.validName')}
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="register-field">
              <label className="register-label">{t('auth.register.password')}</label>
              <input
                className="register-input"
                name="password"
                type="password"
                placeholder={t('auth.register.passwordPlaceholder')}
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              {form.password && (
                <div className="register-strength">
                  <div className="register-strength-track">
                    <div
                      className="register-strength-fill"
                      style={{
                        width: `${getPasswordStrengthWidth(validation.password.strength)}%`,
                        backgroundColor: getPasswordStrengthColor(
                          validation.password.strength,
                        ),
                      }}
                    />
                  </div>
                  <span className="register-strength-label">
                    {t(STRENGTH_KEYS[validation.password.strength] || '')}
                  </span>
                </div>
              )}
              {form.password && validation.password.errors.length > 0 && (
                <div className="register-feedback invalid">
                  {validation.password.errors.map((error, idx) => (
                    <div key={idx}>{"\u2717"} {error}</div>
                  ))}
                </div>
              )}
              {form.password && validation.password.isValid === true && (
                <div className="register-feedback valid">
                  {"\u2713"} {t('auth.register.passwordValid')}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="register-field">
              <label className="register-label">{t('auth.register.confirmPassword')}</label>
              <input
                className="register-input"
                name="confirmPassword"
                type="password"
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {form.confirmPassword &&
                validation.confirmPassword.isValid !== null && (
                  <div
                    className={`register-feedback ${
                      validation.confirmPassword.isValid ? "valid" : "invalid"
                    }`}
                  >
                    {validation.confirmPassword.isValid ? "\u2713" : "\u2717"}{" "}
                    {validation.confirmPassword.errors[0] || t('auth.register.passwordsMatch')}
                  </div>
                )}
            </div>

            <button
              className="register-submit"
              type="submit"
              disabled={!isFormValid}
            >
              {loading ? (
                <>
                  <Spinner size={16} /> {t('auth.register.submitting')}
                </>
              ) : (
                t('auth.register.submit')
              )}
            </button>

            <div className="register-divider">{t('common.or')}</div>

            <button
              className="register-google"
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
              {t('auth.register.google')}
            </button>

            <div className="register-footer">
              {t('auth.register.hasAccount')}{" "}
              <button
                className="register-footer-link"
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
