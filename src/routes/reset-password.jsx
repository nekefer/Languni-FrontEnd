import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader";

const ResetPassword = lazy(() =>
  import("../components/ResetPassword").then((m) => ({ default: m.ResetPassword }))
);

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => ({
    token: search.token ?? "",
  }),
  component: function ResetPasswordRoute() {
    const { token } = Route.useSearch();
    return (
      <Suspense fallback={<PageLoader />}>
        <ResetPassword token={token} />
      </Suspense>
    );
  },
});
