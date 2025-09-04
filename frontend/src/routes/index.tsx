import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="text-center">
      <Button onClick={() => toast.success("Hello world")}>Click me</Button>
    </div>
  );
}
