import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";
import PageLoader from "../components/PageLoader";

const AddVideo = lazy(() =>
  import("../components/AddVideo").then((module) => ({
    default: module.AddVideo,
  })),
);

export const Route = createFileRoute("/add-video")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <Suspense fallback={<PageLoader />}>
          <AddVideo />
        </Suspense>
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
