import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { registerUser, googleRegister, fetchUserInfo } from "../api/auth";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { GuestRoute } from "./GuestRoute";
import { useDebounce } from "../hooks/useDebounce";
import { Spinner } from "../ui/Spinner";
import {
  validatePassword,
  validateName,
  validateEmail,
  validatePasswordMatch,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  getPasswordStrengthWidth,
} from "../utils/validators";
import "../styles/Register.css";

export const Register = () => {
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
        setError("Google authentication failed. Please try again.");
      } else {
        setError("Authentication failed. Please try again.");
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

      toast.success("Account created successfully! Welcome to Linguini.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      if (!err.response) {
        const errorMsg = "Network error. Please check your connection.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 409) {
        const errorMsg = "Email already registered. Please log in instead.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 422 || err.response?.status === 400) {
        const errorMsg =
          err.response?.data?.detail || "Please check your input.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 429) {
        const errorMsg =
          "Too many registration attempts. Please try again later.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg =
          err.response?.data?.detail ||
          "Registration failed. Please try again.";
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
      toast.error("Google registration failed. Please try again.");
    }
  };

  return (
    <GuestRoute>
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          {error && <div className="error">{error}</div>}

          {/* Email Field */}
          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {form.email && validation.email.isValid !== null && (
              <div
                className={`validation-feedback ${
                  validation.email.isValid ? "valid" : "invalid"
                }`}
              >
                {validation.email.isValid ? "✓" : "✗"}{" "}
                {validation.email.errors[0] || "Valid email"}
              </div>
            )}
          </div>

          {/* First Name Field */}
          <div className="form-group">
            <input
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            {form.first_name && validation.first_name.isValid !== null && (
              <div
                className={`validation-feedback ${
                  validation.first_name.isValid ? "valid" : "invalid"
                }`}
              >
                {validation.first_name.isValid ? "✓" : "✗"}{" "}
                {validation.first_name.errors[0] || "Valid name"}
              </div>
            )}
          </div>

          {/* Last Name Field */}
          <div className="form-group">
            <input
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
            {form.last_name && validation.last_name.isValid !== null && (
              <div
                className={`validation-feedback ${
                  validation.last_name.isValid ? "valid" : "invalid"
                }`}
              >
                {validation.last_name.isValid ? "✓" : "✗"}{" "}
                {validation.last_name.errors[0] || "Valid name"}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Password (min 8 characters)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            {form.password && (
              <div className="password-strength-container">
                <div className="password-strength-background">
                  <div
                    className="password-strength-bar"
                    style={{
                      width: `${getPasswordStrengthWidth(validation.password.strength)}%`,
                      backgroundColor: getPasswordStrengthColor(
                        validation.password.strength,
                      ),
                    }}
                  />
                </div>
                <span className="password-strength-label">
                  {getPasswordStrengthLabel(validation.password.strength)}
                </span>
              </div>
            )}
            {form.password && validation.password.errors.length > 0 && (
              <div className="validation-feedback invalid">
                {validation.password.errors.map((error, idx) => (
                  <div key={idx}>✗ {error}</div>
                ))}
              </div>
            )}
            {form.password && validation.password.isValid === true && (
              <div className="validation-feedback valid">
                ✓ Password meets requirements
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {form.confirmPassword &&
              validation.confirmPassword.isValid !== null && (
                <div
                  className={`validation-feedback ${
                    validation.confirmPassword.isValid ? "valid" : "invalid"
                  }`}
                >
                  {validation.confirmPassword.isValid ? "✓" : "✗"}{" "}
                  {validation.confirmPassword.errors[0] || "Passwords match"}
                </div>
              )}
          </div>

          <button type="submit" disabled={!isFormValid}>
            {loading ? (
              <>
                <Spinner size={16} /> Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          <div style={{ margin: "16px 0", textAlign: "center", color: "#666" }}>
            or
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
          >
            Register with Google
          </button>

          <div>
            <span>Already have an account? </span>
            <button type="button" onClick={() => navigate({ to: "/login" })}>
              Login here
            </button>
          </div>
        </form>
      </div>
    </GuestRoute>
  );
};
