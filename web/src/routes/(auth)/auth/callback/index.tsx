import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)/auth/callback/")({
  validateSearch: (search: Record<string, unknown>) => ({
    success: search.success as boolean,
    provider: search.provider as "google" | "github",
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { success, provider } = Route.useSearch();
  const toastFired = useRef(false);

  useEffect(() => {
    if (toastFired.current) return; // prevent double firing

    if (success) {
      if (provider === "google") {
        toast.success("Logged in with Google");
      } else if (provider === "github") {
        toast.success("Logged in with Github");
      }
      navigate({ to: "/dashboard" });
    } else {
      toast.error("Something went wrong");
      navigate({ to: "/signin" });
    }

    toastFired.current = true;
  }, [success, navigate]);

  return <div>Redirecting...</div>;
}
