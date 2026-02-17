import { createFileRoute } from "@tanstack/react-router";
import LandingOne from "../components/landing/LandingOne";

export const Route = createFileRoute("/1")({
  component: LandingOne,
});
