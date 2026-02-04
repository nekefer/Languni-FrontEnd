import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { FullPageSpinner } from "../ui/Spinner";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner text="Checking access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
