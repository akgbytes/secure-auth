import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconSettings, IconLogout } from "@tabler/icons-react";
import { Home } from "lucide-react";
import { AccountSettingsDialog } from "./AccountSettingsDialog";
import { useAuthStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const UserButton = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const { mutate: logout } = useMutation<ApiResponse<null>, ApiAxiosError>({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: (res) => {
      clearUser();
      toast.success(res.message);
      navigate({ to: "/signin" });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar>
            <AvatarImage src={user.avatar} alt="Profile image" />
            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          className="min-w-xs mt-1 mr-4 rounded-xl"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Home className="size-4" aria-hidden="true" />
              <span>Home</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <IconSettings className="size-4" aria-hidden="true" />
              <span>Manage account</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              logout();
            }}
            className="cursor-pointer"
          >
            <IconLogout className="size-4" aria-hidden="true" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AccountSettingsDialog user={user} open={open} onOpenChange={setOpen} />
    </>
  );
};

export default UserButton;
