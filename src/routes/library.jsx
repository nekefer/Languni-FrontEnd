import { createFileRoute } from "@tanstack/react-router";
import { MyLibrary } from "../components/MyLibrary";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";

export const Route = createFileRoute("/library")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <MyLibrary />
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
