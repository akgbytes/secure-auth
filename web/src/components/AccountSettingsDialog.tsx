"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { IconShieldCheckFilled, IconUserCircle } from "@tabler/icons-react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Hamburger, MenuIcon } from "lucide-react";

type state = "profile" | "security";

export function AccountSettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<state>("profile");

  const handleUpdatePassword = () => {
    toast.info("Coming soon...");
  };

  const handleDeleteAccount = () => {
    toast.info("Coming soon...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:min-w-xl md:min-w-3xl lg:min-w-4xl p-0 overflow-hidden rounded-xl">
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <aside className="w-52 hidden md:block border-r bg-muted/30 px-3 py-5">
            <div className="flex flex-col space-y-5">
              <div className="pl-2">
                <h3 className="text-2xl font-semibold">Account</h3>
                <p className="text-sm font-light">Manage your account info</p>
              </div>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-lg cursor-pointer text-foreground/60",
                    activeTab == "profile" && "bg-foreground/10 text-foreground"
                  )}
                  onClick={() => setActiveTab("profile")}
                >
                  <IconUserCircle className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-lg cursor-pointer text-foreground/60",
                    activeTab == "security" &&
                      "bg-foreground/10 text-foreground"
                  )}
                  onClick={() => setActiveTab("security")}
                >
                  <IconShieldCheckFilled className="h-4 w-4" />
                  Security
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          {/* Mobile Menu */}
          <div className="md:hidden absolute top-4 left-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="rounded-xl min-w-[180px]"
              >
                <DropdownMenuItem
                  className={cn(
                    "cursor-pointer",
                    activeTab === "profile" && "bg-muted"
                  )}
                  onClick={() => setActiveTab("profile")}
                >
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    "cursor-pointer",
                    activeTab === "security" && "bg-muted"
                  )}
                  onClick={() => setActiveTab("security")}
                >
                  <IconShieldCheckFilled className="mr-2 h-4 w-4" />
                  Security
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <main className="flex-1 px-8 py-6">
            {activeTab === "profile" && (
              <div className="space-y-5 text-sm">
                <DialogHeader>
                  <DialogTitle className="sm:px-8 md:px-0">
                    Profile details
                  </DialogTitle>
                </DialogHeader>
                <Separator />
                <div className="flex justify-between items-center">
                  <p>Profile</p>
                  <Avatar className="size-12">
                    <AvatarImage
                      className="size-12"
                      src=""
                      alt="Profile image"
                    />
                    <AvatarFallback className="size-12">CN</AvatarFallback>
                  </Avatar>
                  <div></div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <p>Email address</p>
                  <div>akgbytes@gmail.com</div>
                  <div></div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <p>Role</p>
                  <div>Admin</div>
                  <div></div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <DialogHeader>
                  <DialogTitle className="sm:px-8 md:px-0">
                    Security
                  </DialogTitle>
                </DialogHeader>

                {/* Password */}
                <div className="mt-6 flex items-center justify-between border-b pb-4">
                  <p className="text-sm font-medium">Password</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleUpdatePassword}
                  >
                    Update password
                  </Button>
                </div>

                {/* Active Devices */}
                <div className="mt-6 border-b pb-4">
                  <p className="text-sm font-medium mb-2">Active devices</p>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Windows · Chrome 140</span>
                      <span className="text-xs rounded bg-muted px-2 py-0.5">
                        This device
                      </span>
                    </div>
                    <span>117.201.46.239 (Kapsan, IN)</span>
                    <span>Today at 10:39 AM</span>
                  </div>
                </div>

                {/* Delete account */}
                <div className="mt-6">
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    Delete account
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}
