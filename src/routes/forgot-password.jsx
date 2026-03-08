import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader";

const ForgotPassword = lazy(() =>
  import("../components/ForgotPassword").then((m) => ({ default: m.ForgotPassword }))
);

export const Route = createFileRoute("/forgot-password")({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ForgotPassword />
    </Suspense>
  ),
});
