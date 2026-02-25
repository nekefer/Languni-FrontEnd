import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchUserInfo, logoutUser, refreshToken } from "../api/auth";
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

  // Check if user is authenticated on app start
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      authLogger.debug("Checking authentication...");
      const userData = await fetchUserInfo();
      authLogger.debug("User authenticated", { email: userData.email });
      setUser(userData);

      return userData;
    } catch (error) {
      // 401 is expected for unauthenticated users — try to refresh silently
      if (error.response?.status === 401) {
        try {
          authLogger.debug("Attempting token refresh...");
          await refreshToken();
          // Retry getting user info
          const userData = await fetchUserInfo();
          setUser(userData);
          authLogger.debug("Token refreshed successfully");
          return userData;
        } catch {
          // Refresh also failed — user is simply not logged in
          setUser(null);
          return null;
        }
      } else {
        authLogger.debug("Auth check failed", { status: error.response?.status });
        setUser(null);
        return null;
      }
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

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isVerified: !!user?.is_verified,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
