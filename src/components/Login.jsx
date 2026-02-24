import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { loginUser, googleLogin, fetchUserInfo } from "../api/auth";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { GuestRoute } from "./GuestRoute";
import { Spinner } from "../ui/Spinner";
import "../styles/Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const { login } = useAuth();
  const { checkOnboardingStatus } = useOnboarding();

  // Handle error messages from URL params (only OAuth failures now)
  useEffect(() => {
    if (search?.error) {
      if (search.error === "oauth_failed") {
        setError("Google authentication failed. Please try again.");
      } else {
        setError("Authentication failed. Please try again.");
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

      toast.success("Login successful! Welcome back.");
    } catch (err) {
      if (!err.response) {
        const errorMsg = "Network error. Please check your connection.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 401) {
        const errorMsg = "Invalid email or password.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 422 || err.response?.status === 400) {
        const errorMsg =
          err.response?.data?.detail || "Please check your input.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 429) {
        const errorMsg = "Too many login attempts. Please try again later.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg =
          err.response?.data?.detail || "Login failed. Please try again.";
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
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <GuestRoute>
      <div className="login-page">
        {/* Left panel — branding */}
        <div className="login-brand">
          <div className="login-brand-inner">
            <a href="/" className="login-logo">
              Lingu<span>ini</span>
            </a>
            <h1>
              Learn languages from <em>real</em> content.
            </h1>
            <p>
              Pick any YouTube video in Spanish, French, or English. We add
              interactive subtitles — click a word to get instant definitions,
              translations, and context. That's Linguini.
            </p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-sub">
              Log in to continue learning.
            </p>

            {error && <div className="error">{error}</div>}

            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="login-label">Password</label>
                <button
                  type="button"
                  style={{ background: "none", border: "none", fontSize: "13px", color: "#4f46e5", cursor: "pointer", padding: 0 }}
                  onClick={() => navigate({ to: "/forgot-password" })}
                >
                  Forgot password?
                </button>
              </div>
              <input
                className="login-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size={16} /> Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>

            <div className="login-divider">or</div>

            <button
              className="login-google"
              type="button"
              onClick={handleGoogleLogin}
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
              Continue with Google
            </button>

            <div className="login-footer">
              Don't have an account?{" "}
              <button
                className="login-footer-link"
                type="button"
                onClick={() => navigate({ to: "/register" })}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </GuestRoute>
  );
};
