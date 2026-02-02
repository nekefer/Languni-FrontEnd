import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import { initSentry } from "./utils/sentry";

// Initialize Sentry before rendering (production only)
initSentry();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-right" richColors expand closeButton />
    <App />
  </React.StrictMode>,
);
