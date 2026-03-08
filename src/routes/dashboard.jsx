import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";
import PageLoader from "../components/PageLoader";

const Dashboard = lazy(() =>
  import("../components/Dashboard").then((m) => ({ default: m.Dashboard }))
);

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <Suspense fallback={<PageLoader />}>
          <Dashboard />
        </Suspense>
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
