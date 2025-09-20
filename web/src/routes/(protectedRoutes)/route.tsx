import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(protectedRoutes)")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
