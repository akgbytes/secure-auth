import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protectedRoutes)")({
  beforeLoad({ context, location }) {
    const auth = context.auth;

    if (!auth.isAuthenticated) {
      throw redirect({
        to: "/signin",
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
