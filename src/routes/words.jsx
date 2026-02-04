import { createFileRoute } from "@tanstack/react-router";
import { MyVocabulary } from "../components/MyVocabulary";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";

export const Route = createFileRoute("/words")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <MyVocabulary />
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
