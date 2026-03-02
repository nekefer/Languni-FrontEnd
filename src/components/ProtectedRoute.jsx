import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { FullPageSpinner } from "../ui/Spinner";
import { AppLayout } from "./AppLayout";

export const ProtectedRoute = ({ children, noLayout = false }) => {
  const { isAuthenticated, isVerified, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner text="Checking access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (noLayout) return children;

  return <AppLayout>{children}</AppLayout>;
};
