import * as React from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import "./styles/app.css";

const router = createRouter({ routeTree });

export default function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <RouterProvider router={router} />
      </OnboardingProvider>
    </AuthProvider>
  );
}
