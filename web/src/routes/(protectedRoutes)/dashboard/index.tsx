import NotFoundPage from "@/components/NotFoundPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protectedRoutes)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <NotFoundPage />
    </div>
  );
}
