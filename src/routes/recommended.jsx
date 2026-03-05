import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";
import PageLoader from "../components/PageLoader";

const RecommendedPage = lazy(() =>
  import("../components/RecommendedPage").then((m) => ({ default: m.RecommendedPage }))
);

export const Route = createFileRoute("/recommended")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <Suspense fallback={<PageLoader />}>
          <RecommendedPage />
        </Suspense>
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
