import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protectedRoutes)")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protectedRoutes)/routes"!</div>;
}
