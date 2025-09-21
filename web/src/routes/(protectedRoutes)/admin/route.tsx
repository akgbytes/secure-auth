import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(protectedRoutes)/admin")({
  beforeLoad({ context }) {
    const auth = context.auth;

    if (auth.user?.role !== "admin") {
      throw notFound();
    }
  },
  component: () => <Outlet />,
});
