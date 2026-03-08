import { Navigate } from "@tanstack/react-router";
import { useOnboarding } from "../contexts/OnboardingContext";
import { FullPageSpinner } from "../ui/Spinner";

/**
 * Route guard that ensures user has completed onboarding.
 * Must be used inside ProtectedRoute (user must be authenticated first).
 *
 * Usage:
 * <ProtectedRoute>
 *   <RequireOnboarding>
 *     <Dashboard />
 *   </RequireOnboarding>
 * </ProtectedRoute>
 */
export const RequireOnboarding = ({ children }) => {
  const { hasCompletedOnboarding, onboardingLoading } = useOnboarding();

  // Show loading while checking onboarding status
  if (onboardingLoading) {
    return <FullPageSpinner text="Setting up your account..." />;
  }

  // Redirect to onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};
