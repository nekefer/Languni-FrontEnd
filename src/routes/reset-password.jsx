import { createFileRoute } from "@tanstack/react-router";
import { ResetPassword } from "../components/ResetPassword";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => ({
    token: search.token ?? "",
  }),
  component: function ResetPasswordRoute() {
    const { token } = Route.useSearch();
    return <ResetPassword token={token} />;
  },
});
