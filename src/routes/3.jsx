import { createFileRoute } from "@tanstack/react-router";
import LandingThree from "../components/landing/LandingThree";

export const Route = createFileRoute("/3")({
  component: LandingThree,
});
