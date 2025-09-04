import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/email-resend/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(auth)/email-resend/"!</div>;
}
