import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { OnboardingFlow } from "../components/Onboarding/OnboardingFlow";

export const Route = createFileRoute("/onboarding")({
  component: () => (
    <ProtectedRoute noLayout>
      <OnboardingFlow />
    </ProtectedRoute>
  ),
});
