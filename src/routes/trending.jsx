import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";
import PageLoader from "../components/PageLoader";

const TrendingPage = lazy(() =>
  import("../components/TrendingPage").then((m) => ({ default: m.TrendingPage }))
);

export const Route = createFileRoute("/trending")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <Suspense fallback={<PageLoader />}>
          <TrendingPage />
        </Suspense>
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
