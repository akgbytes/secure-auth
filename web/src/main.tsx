import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import { Toaster } from "./components/ui/sonner.tsx";
import { useAuthStore } from "./store/index.ts";

import { routeTree } from "./routeTree.gen";
import reportWebVitals from "./reportWebVitals.ts";
import { ThemeProvider } from "./components/theme-provider.tsx";

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

  // useEffect(() => {
  //   auth.checkAuth(); // Restore auth state on app load
  // }, []);

  // if (auth.loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="flex flex-col items-center gap-2">
  //         <LoaderCircle className="animate-spin text-sky-600 size-6" />
  //         <span>Authenticating</span>
  //       </div>
  //     </div>
  //   );
  // }

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
