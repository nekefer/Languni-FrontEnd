import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchUserInfo, logoutUser } from "../api/auth";
import { authLogger } from "../utils/logger";

const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app start.
  // Token refresh is handled transparently by the axios interceptor.
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      authLogger.debug("Checking authentication...");
      const userData = await fetchUserInfo();
      authLogger.debug("User authenticated", { email: userData.email });
      setUser(userData);
      return userData;
    } catch {
      // Not logged in, or refresh also failed — stay on landing page
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setError(null);

    authLogger.info("User logged in", { method: userData.auth_method });
  };

  const register = (userData) => {
    setUser(userData);
    setError(null);

    authLogger.info("User registered", { method: userData.auth_method });
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      authLogger.error("Logout failed", error);
    } finally {
      setUser(null);
      setError(null);

    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Re-check auth on window focus when user is unverified
  // so the verification banner disappears automatically after clicking the email link in another tab
  useEffect(() => {
    if (!user || user.is_verified) return;
    const handleFocus = () => checkAuth();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, checkAuth]);

  // Interceptor fires this when a refresh fails mid-session
  useEffect(() => {
    const handleSessionExpired = () => {
      if (!user) return; // not logged in — ignore
      authLogger.info("Session expired, logging out");
      setUser(null);
      setError(null);
    };

    window.addEventListener("auth:sessionExpired", handleSessionExpired);
    return () => window.removeEventListener("auth:sessionExpired", handleSessionExpired);
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isVerified: !!user?.is_verified,
    isPremium: user?.subscription_plan === 'premium',
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
