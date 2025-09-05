import { capitalize } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protectedRoutes/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col px-4 py-2">
      <h1 className="text-2xl d:text-3xl">Basic Information</h1>

      <div className="py-4 space-y-4">
        <div>
          <div className="text-lg">ID</div>
          <div className="text-muted-foreground text-sm">{user?.id}</div>
        </div>
        <div>
          <div className="text-lg">Name</div>
          <div className="text-muted-foreground text-sm">
            {capitalize(user?.name || "")}
          </div>
        </div>
        <div>
          <div className="text-lg">Email</div>
          <div className="text-muted-foreground text-sm">{user?.email}</div>
        </div>
        <div>
          <div className="text-lg">Role</div>
          <div className="text-muted-foreground text-sm">
            {capitalize(user?.role || "")}
          </div>
        </div>
      </div>
    </div>
  );
}
