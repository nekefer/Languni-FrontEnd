import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmail } from "../components/VerifyEmail";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search) => ({
    token: search.token ?? "",
  }),
  component: function VerifyEmailRoute() {
    const { token } = Route.useSearch();
    return <VerifyEmail token={token} />;
  },
});
