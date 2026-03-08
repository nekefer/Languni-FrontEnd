import * as React from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";
import posthog from "posthog-js";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/app.css";

const router = createRouter({ routeTree, defaultPreload: "intent" });

router.subscribe("onResolved", () => {
  posthog.capture("$pageview", { $current_url: window.location.href });
});

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <OnboardingProvider>
            <RouterProvider router={router} />
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
