import "./index.css";
import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import { Toaster } from "./components/ui/sonner.tsx";
import { useAuthStore } from "./store/index.ts";

import { routeTree } from "./routeTree.gen";
import reportWebVitals from "./reportWebVitals.ts";
import { ThemeProvider } from "./components/theme-provider.tsx";
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
  defaultStaleTime: 90 * 1000, // 1.5 minutes
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
      <div className="flex items-center justify-center h-screen">
        <Spinner className="size-8 text-green-800" />
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <InnerApp />
        </TanStackQueryProvider.Provider>
        <Toaster richColors />
      </ThemeProvider>
    </StrictMode>
  );
}

reportWebVitals();
