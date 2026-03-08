import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader";

const VerifyEmail = lazy(() =>
  import("../components/VerifyEmail").then((m) => ({ default: m.VerifyEmail }))
);

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search) => ({
    token: search.token ?? "",
  }),
  component: function VerifyEmailRoute() {
    const { token } = Route.useSearch();
    return (
      <Suspense fallback={<PageLoader />}>
        <VerifyEmail token={token} />
      </Suspense>
    );
  },
});
