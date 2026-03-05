import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader";

const Login = lazy(() =>
  import("../components/Login").then((m) => ({ default: m.Login }))
);

export const Route = createFileRoute("/login")({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Login />
    </Suspense>
  ),
});
