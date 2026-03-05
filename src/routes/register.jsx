import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader";

const Register = lazy(() =>
  import("../components/Register").then((m) => ({ default: m.Register }))
);

export const Route = createFileRoute("/register")({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Register />
    </Suspense>
  ),
});
