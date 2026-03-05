import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RequireOnboarding } from "../components/RequireOnboarding";
import PageLoader from "../components/PageLoader";

const MyLibrary = lazy(() =>
  import("../components/MyLibrary").then((m) => ({ default: m.MyLibrary }))
);

export const Route = createFileRoute("/library")({
  component: () => (
    <ProtectedRoute>
      <RequireOnboarding>
        <Suspense fallback={<PageLoader />}>
          <MyLibrary />
        </Suspense>
      </RequireOnboarding>
    </ProtectedRoute>
  ),
});
