import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader";

const VerifyEmailPending = lazy(() =>
  import("../components/VerifyEmailPending").then((m) => ({ default: m.VerifyEmailPending }))
);

export const Route = createFileRoute("/verify-email-pending")({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <VerifyEmailPending />
    </Suspense>
  ),
});
