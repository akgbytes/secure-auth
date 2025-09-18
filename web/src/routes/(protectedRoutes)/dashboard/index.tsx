import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protectedRoutes)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protectedRoutes)/dashboard/"!</div>;
}
