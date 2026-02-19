import { createFileRoute } from "@tanstack/react-router";
import LandingFour from "../components/landing/LandingFour";

export const Route = createFileRoute("/4")({
  component: LandingFour,
});
