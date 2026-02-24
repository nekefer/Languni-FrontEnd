import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { FullPageSpinner } from "../ui/Spinner";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isVerified, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner text="Checking access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email-pending" />;
  }

  return children;
};
