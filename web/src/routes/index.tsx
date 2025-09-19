import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { ModeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <header>
      <div className="container mx-auto px-16 sm:px-24 lg:px-32">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <IconInnerShadowTop className="size-5" />
            <h1 className="text-xl font-bold">SecureAuth</h1>
          </div>

          <div className="flex gap-2">
            <ModeToggle />
            <a
              href="https://github.com/akgbytes/secure-auth"
              aria-label="GitHub Repository"
              target="_blank"
            >
              <Button variant={"ghost"} className="cursor-pointer">
                <FiGithub className="size-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
