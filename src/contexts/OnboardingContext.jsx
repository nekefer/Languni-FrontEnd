import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import preferencesService from "../api/preferences";
import { createLogger } from "../utils/logger";

const logger = createLogger("onboarding");

const OnboardingContext = createContext();

// Custom hook to use the OnboardingContext
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

// OnboardingProvider component
export const OnboardingProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Check onboarding status from backend
  // useCallback is necessary here because it's used in useEffect dependency array
  const checkOnboardingStatus = useCallback(async () => {
    setOnboardingLoading(true);
    try {
      const completed = await preferencesService.isOnboardingCompleted();
      setHasCompletedOnboarding(completed);
      logger.debug("Onboarding status checked", { completed });
      return completed;
    } catch (error) {
      logger.error("Failed to check onboarding status", error);
      setHasCompletedOnboarding(false);
      return false;
    } finally {
      setOnboardingLoading(false);
    }
  }, []);

  // Mark user as new (called after registration)
  const markAsNewUser = () => {
    setIsNewUser(true);
    setHasCompletedOnboarding(false);
    setOnboardingLoading(false);
    logger.debug("User marked as new");
  };

  // Clear the new user flag
  const clearNewUserFlag = () => setIsNewUser(false);

  // Mark onboarding as completed (called after onboarding flow)
  const markOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setIsNewUser(false);
    logger.info("Onboarding marked as complete");
  };

  // Reset onboarding state (called on logout)
  const resetOnboardingState = () => {
    setHasCompletedOnboarding(false);
    setOnboardingLoading(true);
    setIsNewUser(false);
  };

  // Check onboarding status when user becomes authenticated on page refresh
  useEffect(() => {
    if (!authLoading && isAuthenticated && !isNewUser) {
      checkOnboardingStatus();
    } else if (!authLoading && !isAuthenticated) {
      setOnboardingLoading(false);
    }
  }, [authLoading, isAuthenticated, isNewUser, checkOnboardingStatus]);

  const value = {
    hasCompletedOnboarding,
    onboardingLoading,
    isNewUser,
    checkOnboardingStatus,
    markAsNewUser,
    clearNewUserFlag,
    markOnboardingComplete,
    resetOnboardingState,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
