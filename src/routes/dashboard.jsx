import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AppLayout } from "../components/AppLayout";
import { RequireOnboarding } from "../components/RequireOnboarding";
import PageLoader from "../components/PageLoader";
import { useAuth } from "../contexts/auth-context";

const Dashboard = lazy(() =>
  import("../components/Dashboard").then((m) => ({ default: m.Dashboard }))
);

function DashboardRoute() {
  const { isAuthenticated } = useAuth();
  const content = (
    <Suspense fallback={<PageLoader />}>
      <Dashboard />
    </Suspense>
  );

  return (
    <AppLayout>
      {isAuthenticated ? <RequireOnboarding>{content}</RequireOnboarding> : content}
    </AppLayout>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
});
