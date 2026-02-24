import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPending } from "../components/VerifyEmailPending";

export const Route = createFileRoute("/verify-email-pending")({
  component: VerifyEmailPending,
});
