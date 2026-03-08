import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader";

const TermsOfService = lazy(() => import("../components/TermsOfService"));

export const Route = createFileRoute("/terms")({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TermsOfService />
    </Suspense>
  ),
});
