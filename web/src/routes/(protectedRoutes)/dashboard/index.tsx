import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protectedRoutes)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Admin dashboard</h1>
    </div>
  );
}
