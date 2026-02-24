import React from "react";
import { createRoot } from "react-dom/client";
import { App as InertiaApp, Head } from "@inertiajs/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

/**
 * Main entry for Inertia + MUI app.
 */
const el = document.getElementById("app");

createRoot(el).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InertiaApp
        initialPage={JSON.parse(el.dataset.page)}
        resolveComponent={(name) =>
          import(`./Pages/${name}`).then((module) => module.default)
        }
      />
    </ThemeProvider>
  </React.StrictMode>
);
