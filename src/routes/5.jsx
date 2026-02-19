import { createFileRoute } from "@tanstack/react-router";
import LandingFive from "../components/landing/LandingFive";

export const Route = createFileRoute("/5")({
  component: LandingFive,
});
