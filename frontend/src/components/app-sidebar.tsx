import * as React from "react";
import {
  IconInnerShadowTop,
  IconLock,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store";
import { Link } from "@tanstack/react-router";

export const getNavMain = (role: "user" | "admin") => {
  const baseNav = [
    {
      title: "Profile",
      url: "/dashboard",
      icon: IconUser,
    },
    {
      title: "Sessions",
      url: "/dashboard/sessions",
      icon: IconLock,
    },
  ];

  if (role === "admin") {
    baseNav.push({
      title: "Manage Users",
      url: "/dashboard/admin/users",
      icon: IconUsers,
    });
  }

  return baseNav;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const navMain = getNavMain(user?.role || "user");
  return (
    <Sidebar className="border-r" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SecureAuth</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
