import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { loginUser, googleLogin, fetchUserInfo } from "../api/auth";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { GuestRoute } from "./GuestRoute";
import { Spinner, FullPageSpinner } from "../ui/Spinner";
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
      // Set user in auth context
      login(userData);

      navigate({to: "/dashboard"})

      toast.success("Login successful! Welcome back.");

    } catch (err) {
      // Handle different error types
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
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <div className="error">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <><Spinner size={16} /> Logging in...</> : "Login"}
          </button>
          <button type="button" onClick={handleGoogleLogin} disabled={loading}>
            Continue with Google
          </button>
          <div>
            <span>Don't have an account? </span>
            <button type="button" onClick={() => navigate({ to: "/register" })}>
              Register here
            </button>
          </div>
        </form>
      </div>
    </GuestRoute>
  );
};
