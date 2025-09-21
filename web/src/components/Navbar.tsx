import { IconInnerShadowTop } from "@tabler/icons-react";
import React from "react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { FiGithub } from "react-icons/fi";
import UserButton from "./UserButton";
import { useAuthStore } from "@/store";

const Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  return (
    <header>
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <IconInnerShadowTop className="size-5" />
          <h1 className="text-xl font-bold">SecureAuth</h1>
        </div>

        <div className="flex gap-2">
          <ModeToggle />
          <a
            href="https://github.com/akgbytes/secure-auth"
            aria-label="GitHub Repo"
            target="_blank"
          >
            <Button variant={"ghost"} className="cursor-pointer">
              <FiGithub className="size-4" />
            </Button>
          </a>

          {isAuthenticated && <UserButton />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
