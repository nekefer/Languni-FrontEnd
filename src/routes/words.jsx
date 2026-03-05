import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";
import PageLoader from "../components/PageLoader";

const MyVocabulary = lazy(() =>
  import("../components/MyVocabulary").then((m) => ({ default: m.MyVocabulary }))
);

export const Route = createFileRoute("/words")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <Suspense fallback={<PageLoader />}>
          <MyVocabulary />
        </Suspense>
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
