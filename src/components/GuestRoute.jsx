// src/components/GuestRoute.jsx
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { FullPageSpinner } from "../ui/Spinner";

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // if (loading) {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
  //       Checking authentication...
  //     </div>
  //   );
  // }
  if (loading) {
      return <FullPageSpinner text="Checking authentication..." />;
    }

  // If already logged in → send to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
