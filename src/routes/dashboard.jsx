import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "../components/Dashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <Dashboard />
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
