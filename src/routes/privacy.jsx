import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader";

const PrivacyPolicy = lazy(() => import("../components/PrivacyPolicy"));

export const Route = createFileRoute("/privacy")({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PrivacyPolicy />
    </Suspense>
  ),
});
