import { createFileRoute } from "@tanstack/react-router";
import { OnboardingFlow } from "../components/Onboarding/OnboardingFlow";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const Route = createFileRoute("/onboarding")({
  component: () => (
    <ProtectedRoute>
      <OnboardingFlow />
    </ProtectedRoute>
  ),
});
