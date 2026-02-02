import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchUserInfo, logoutUser, refreshToken } from "../api/auth";
import { authLogger } from "../utils/logger";
import { setSentryUser, clearSentryUser } from "../utils/sentry";

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
  const [isNewUser, setIsNewUser] = useState(false); // Track new registration

  // Check if user is authenticated on app start
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      authLogger.debug("Checking authentication...");
      const userData = await fetchUserInfo();
      authLogger.debug("User authenticated", { email: userData.email });
      setUser(userData);
      setSentryUser(userData);
    } catch (error) {
      authLogger.debug("Not authenticated", { status: error.response?.status });

      // If 401, try to refresh token
      if (error.response?.status === 401) {
        try {
          authLogger.debug("Attempting token refresh...");
          await refreshToken();
          // Retry getting user info
          const userData = await fetchUserInfo();
          setUser(userData);
          setSentryUser(userData);
          authLogger.debug("Token refreshed successfully");
        } catch (refreshError) {
          authLogger.debug("Token refresh failed");
          setUser(null);
          clearSentryUser();
        }
      } else {
        setUser(null);
        clearSentryUser();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setError(null);
    setIsNewUser(false);
    setSentryUser(userData);
    authLogger.info("User logged in", { method: userData.auth_method });
  };

  // Called after registration to set user and mark as new
  const register = (userData) => {
    setUser(userData);
    setError(null);
    setIsNewUser(true);
    setSentryUser(userData);
    authLogger.info("User registered", { method: userData.auth_method });
  };

  // Clear the new user flag after onboarding is handled
  const clearNewUserFlag = () => {
    setIsNewUser(false);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      authLogger.error("Logout failed", error);
    } finally {
      setUser(null);
      setError(null);
      setIsNewUser(false);
      clearSentryUser();
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isNewUser,
    login,
    register,
    logout,
    checkAuth,
    clearNewUserFlag,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
