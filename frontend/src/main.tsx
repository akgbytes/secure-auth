import "./styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { routeTree } from "./routeTree.gen";

import { Toaster } from "./components/ui/sonner.tsx";

import reportWebVitals from "./reportWebVitals.ts";
import { useAuthStore } from "./store/index.ts";
import { CLIENT_ID } from "./constants/env.ts";
import Spinner from "./components/Spinner.tsx";

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
      <div className="min-h-screen w-full relative text-neutral-100">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: "#0a0a0a",
            backgroundImage: `
       radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
       radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
     `,
            backgroundSize: "10px 10px",
            imageRendering: "pixelated",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-2">
              <Spinner
                text="Checking authentication..."
                className="text-sky-600 size-6"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative text-neutral-100">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: `
       radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
       radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
     `,
          backgroundSize: "10px 10px",
          imageRendering: "pixelated",
        }}
      />
      <div className="relative z-10">
        <RouterProvider router={router} context={{ auth }} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <InnerApp />
        </TanStackQueryProvider.Provider>
        <Toaster />
      </GoogleOAuthProvider>
    </StrictMode>
  );
}

reportWebVitals();
