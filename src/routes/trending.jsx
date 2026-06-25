import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AppLayout } from "../components/AppLayout";
import { RequireOnboarding } from "../components/RequireOnboarding";
import PageLoader from "../components/PageLoader";
import { useAuth } from "../contexts/auth-context";

const TrendingPage = lazy(() =>
  import("../components/TrendingPage").then((m) => ({ default: m.TrendingPage }))
);

function TrendingRoute() {
  const { isAuthenticated } = useAuth();
  const content = (
    <Suspense fallback={<PageLoader />}>
      <TrendingPage />
    </Suspense>
  );

  return (
    <AppLayout>
      {isAuthenticated ? <RequireOnboarding>{content}</RequireOnboarding> : content}
    </AppLayout>
  );
}

export const Route = createFileRoute("/trending")({
  component: TrendingRoute,
});
