import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { capitalize, cn } from "@/lib/utils";

import { IconShieldCheckFilled, IconUserCircle } from "@tabler/icons-react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Eye, EyeOff, MenuIcon } from "lucide-react";
import { UpdateProfileDialog } from "./UpdateProfileDialog";

import type { ApiAxiosError, ApiResponse, User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSessions } from "@/services/session.service";
import { api } from "@/lib/axios";
import { Input } from "./ui/input";

type state = "profile" | "security";

export function AccountSettingsDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  user: User;
}) {
  const [openUpdateProfileDialog, setOpenUpdateProfileDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<state>("profile");

  const result = useQuery({
    queryKey: ["sessions"],
    queryFn: () => fetchSessions(),
  });

  const sessions = result.data || [];

  // logout from session
  const { mutate: logout, isPending: logoutPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    { id: string }
  >({
    mutationFn: async ({ id }) => {
      const res = await api.delete(`/sessions/${id}`);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      result.refetch();
    },
    onError: () => {
      toast.error("Error while logging out, Please try again.");
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // update password
  const { mutate: updatePassword, isPending: passwordPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    { password: string }
  >({
    mutationFn: async (values) => {
      const response = await api.patch("/user/password", values);
      return response.data;
    },
    onSuccess: (res) => {
      passwordRef.current!.value = "";
      toast.success(res.message);
      result.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdatePassword = () => {
    const newPassword = passwordRef.current?.value || "";

    console.log("new: ", newPassword.length);

    if (!newPassword) {
      passwordRef.current?.focus();
      return toast.error("Please enter new password first");
    }

    if (newPassword.length < 8) {
      return toast.error("Password must contain atleast 8 characters");
    }
    if (newPassword.length > 72) {
      return toast.error("Password must be at most of 72 characters");
    }

    updatePassword({ password: newPassword });
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
                    "w-full justify-start rounded-lg text-foreground/60 cursor-pointer",
                    activeTab === "profile" &&
                      "bg-primary hover:bg-primary dark:hover:bg-primary text-neutral-100 hover:text-neutral-100"
                  )}
                  onClick={() => setActiveTab("profile")}
                >
                  <IconUserCircle className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-lg text-foreground/60 cursor-pointer",
                    activeTab === "security" &&
                      "bg-primary hover:bg-primary dark:hover:bg-primary text-neutral-100 hover:text-neutral-100"
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
          <div className="flex-1 px-8 py-6 overflow-y-auto">
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

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-5 text-sm">
                <DialogHeader>
                  <DialogTitle className="sm:px-8 md:px-0">
                    Profile details
                  </DialogTitle>
                  <DialogDescription>
                    View your personal information, email, and role settings.
                  </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="grid grid-cols-3 justify-between items-center">
                  <p>Profile</p>
                  <Avatar className="size-12">
                    <AvatarImage src={user.avatar} alt="Profile image" />
                    <AvatarFallback className="size-12">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => setOpenUpdateProfileDialog(true)}
                  >
                    Update profile
                  </Button>

                  <UpdateProfileDialog
                    open={openUpdateProfileDialog}
                    onOpenChange={setOpenUpdateProfileDialog}
                    currentImage="https://example.com/avatar.png"
                    name="Aman"
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-3 justify-between items-center">
                  <p>Email address</p>
                  <div>{user.email}</div>
                  <div></div>
                </div>
                <Separator />
                <div className="grid grid-cols-3 justify-between items-center">
                  <p>Role</p>
                  <div>{capitalize(user.role)}</div>
                  <div></div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="flex flex-col space-y-6">
                <DialogHeader>
                  <DialogTitle className="sm:px-8 md:px-0">
                    Security
                  </DialogTitle>
                  <DialogDescription>
                    Manage your password and active devices for account
                    security.
                  </DialogDescription>
                </DialogHeader>

                {/* Password */}
                <div className="flex items-center gap-4 justify-between border-b pb-4">
                  <div className="relative w-full">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      ref={passwordRef}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUpdatePassword}
                    className="cursor-pointer"
                    disabled={passwordPending}
                  >
                    Update password
                  </Button>
                </div>

                {/* Active Devices */}
                <div className="border-b pb-4 w-full overflow-y-auto max-h-[300px]">
                  <p className="text-sm font-medium mb-2">Active devices</p>
                  <div className="space-y-4 w-full">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex justify-between items-center w-full text-xs sm:text-sm"
                      >
                        <div>
                          <div>{session.device}</div>
                          <div>
                            {session.ip}, ({session.location})
                          </div>
                          <div>{session.lastLogin}</div>
                        </div>
                        <div className="mr-4">
                          {session.current ? (
                            <span className="text-xs rounded bg-muted px-2 py-0.5">
                              This device
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="text-xs rounded h-6"
                              onClick={() => {
                                logout({ id: session.id });
                              }}
                              disabled={logoutPending}
                            >
                              Logout
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delete account */}
                <div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    Delete account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
