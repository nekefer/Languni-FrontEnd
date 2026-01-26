import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchUserInfo, logoutUser, refreshToken } from "../api/auth";

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
      console.log("🔍 Checking authentication...");
      const userData = await fetchUserInfo();
      console.log("✅ User authenticated:", userData);
      setUser(userData);
    } catch (error) {
      console.log("❌ Not authenticated:", error.response?.status);

      // If 401, try to refresh token
      if (error.response?.status === 401) {
        try {
          console.log("🔄 Trying to refresh token...");
          await refreshToken();
          // Retry getting user info
          const userData = await fetchUserInfo();
          setUser(userData);
          console.log("✅ Token refreshed, user authenticated");
        } catch (refreshError) {
          console.log("❌ Token refresh failed", refreshError);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setError(null);
    setIsNewUser(false); // Login = NOT a new user
  };

  // Called after registration to set user and mark as new
  const register = (userData) => {
    setUser(userData);
    setError(null);
    setIsNewUser(true); // Register = IS a new user
  };

  // Clear the new user flag after onboarding is handled
  const clearNewUserFlag = () => {
    setIsNewUser(false);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setError(null);
      setIsNewUser(false); // Reset on logout
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
