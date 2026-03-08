import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import App from "./App";
import "./i18n";
import "./api/interceptors";
import config from "./config";

if (config.posthogKey) {
  posthog.init(config.posthogKey, {
    api_host: config.posthogHost,
    capture_pageview: false,  // handled manually via router
    capture_pageleave: true,
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <Toaster position="top-right" richColors expand closeButton />
      <App />
    </PostHogProvider>
  </React.StrictMode>,
);
