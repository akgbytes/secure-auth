import { useAuthStore } from "@/store";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_protectedRoutes")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/signin" });
    }
  }, [isAuthenticated]);

  return isAuthenticated ? <Outlet /> : null;
}
