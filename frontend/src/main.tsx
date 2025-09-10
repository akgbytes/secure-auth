import "./styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/theme-provider";
import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { routeTree } from "./routeTree.gen";

import { Toaster } from "./components/ui/sonner.tsx";

import reportWebVitals from "./reportWebVitals.ts";
import { useAuthStore } from "./store/index.ts";
import { ThemedBackground } from "./components/themed-background.tsx";

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,

    auth: undefined!,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuthStore();

  useEffect(() => {
    auth.checkAuth(); // Restore auth state on app load
  }, []);

  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking auth...
      </div>
    );
  }

  return (
    <ThemedBackground>
      <RouterProvider router={router} context={{ auth }} />
    </ThemedBackground>
  );
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
            <InnerApp />
          </TanStackQueryProvider.Provider>
          <Toaster />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

reportWebVitals();
