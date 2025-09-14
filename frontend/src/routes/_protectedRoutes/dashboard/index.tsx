import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/utils/capitalize";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protectedRoutes/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  return (
    <div className="max-w-2xl p-6">
      <h2 className="text-3xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-2 gap-12 justify-center items-center">
        <div>
          <p className="text-lg font-medium text-zinc-300">User ID</p>
          <p className="text-sm">{auth.user?.id}</p>
        </div>
        <div>
          <p className="text-lg font-medium text-zinc-300">Name</p>
          <p className="text-sm">{capitalize(auth.user?.name || "")}</p>
        </div>
        <div>
          <p className="text-lg font-medium text-zinc-300">Email</p>
          <p className="text-sm">{auth.user?.email}</p>
        </div>
        <div>
          <p className="text-lg font-medium text-zinc-300">Role</p>
          <Badge className="bg-blue-600 text-neutral-100">
            {auth.user?.role}
          </Badge>
        </div>
      </div>
    </div>
  );
}
