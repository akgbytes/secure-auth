import { capitalize } from "@/lib/utils";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protectedRoutes/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  return (
    <div className="flex flex-col px-4 py-2">
      <h1 className="text-2xl d:text-3xl">Basic Information</h1>

      <div className="py-4 space-y-4">
        <div>
          <div className="text-lg">ID</div>
          <div className="text-muted-foreground text-sm">{auth.user?.id}</div>
        </div>
        <div>
          <div className="text-lg">Name</div>
          <div className="text-muted-foreground text-sm">
            {capitalize(auth.user?.name || "")}
          </div>
        </div>
        <div>
          <div className="text-lg">Email</div>
          <div className="text-muted-foreground text-sm">
            {auth.user?.email}
          </div>
        </div>
        <div>
          <div className="text-lg">Role</div>
          <div className="text-muted-foreground text-sm">
            {capitalize(auth.user?.role || "")}
          </div>
        </div>
      </div>
    </div>
  );
}
