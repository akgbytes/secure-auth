import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protectedRoutes)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>You are logged in</div>;
}
