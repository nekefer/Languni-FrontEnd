import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PageLoader from "../components/PageLoader";

const Settings = lazy(() => import("../components/Settings"));

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <Settings />
      </Suspense>
    </ProtectedRoute>
  );
}
