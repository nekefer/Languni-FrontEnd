import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PageLoader from "../components/PageLoader";

const OnboardingFlow = lazy(() =>
  import("../components/Onboarding/OnboardingFlow").then((m) => ({ default: m.OnboardingFlow }))
);

export const Route = createFileRoute("/onboarding")({
  component: () => (
    <ProtectedRoute noLayout>
      <Suspense fallback={<PageLoader />}>
        <OnboardingFlow />
      </Suspense>
    </ProtectedRoute>
  ),
});
