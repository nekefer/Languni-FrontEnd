import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchUserInfo, logoutUser, refreshToken } from "../api/auth";
import preferencesService from "../api/preferences";
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
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);

  // Fetch onboarding status
  const checkOnboardingStatus = useCallback(async () => {
    try {
      const completed = await preferencesService.isOnboardingCompleted();
      setHasCompletedOnboarding(completed);
      return completed;
    } catch (error) {
      authLogger.error("Failed to check onboarding status", error);
      setHasCompletedOnboarding(false);
      return false;
    } finally {
      setOnboardingLoading(false);
    }
  }, []);

  // Check if user is authenticated on app start
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setOnboardingLoading(true);
    setError(null);

    try {
      authLogger.debug("Checking authentication...");
      const userData = await fetchUserInfo();
      authLogger.debug("User authenticated", { email: userData.email });
      setUser(userData);
      setSentryUser(userData);
      // Check onboarding status after successful auth
      await checkOnboardingStatus();
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
          // Check onboarding status after successful refresh
          await checkOnboardingStatus();
        } catch (refreshError) {
          authLogger.debug("Token refresh failed");
          setUser(null);
          setHasCompletedOnboarding(false);
          setOnboardingLoading(false);
          clearSentryUser();
        }
      } else {
        setUser(null);
        setHasCompletedOnboarding(false);
        setOnboardingLoading(false);
        clearSentryUser();
      }
    } finally {
      setLoading(false);
    }
  }, [checkOnboardingStatus]);

  const login = async (userData) => {
    setUser(userData);
    setError(null);
    setIsNewUser(false);
    setSentryUser(userData);
    authLogger.info("User logged in", { method: userData.auth_method });
    // Check onboarding status after login
    await checkOnboardingStatus();
  };

  // Called after registration to set user and mark as new
  const register = (userData) => {
    setUser(userData);
    setError(null);
    setIsNewUser(true);
    setHasCompletedOnboarding(false); // New users haven't completed onboarding
    setOnboardingLoading(false);
    setSentryUser(userData);
    authLogger.info("User registered", { method: userData.auth_method });
  };

  // Clear the new user flag after onboarding is handled
  const clearNewUserFlag = () => {
    setIsNewUser(false);
  };

  // Mark onboarding as completed (called after onboarding flow)
  const markOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
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
      setHasCompletedOnboarding(false);
      setOnboardingLoading(false);
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
    hasCompletedOnboarding,
    onboardingLoading,
    login,
    register,
    logout,
    checkAuth,
    clearNewUserFlag,
    markOnboardingComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
