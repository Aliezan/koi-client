"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  Shield,
  Heart,
  Gavel,
  History,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";

interface SidebarNavProps {
  isAdmin?: boolean;
}

const adminNavigation = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Users",
        icon: Users,
        href: "/users",
      },
      {
        title: "Inventory",
        icon: Package,
        href: "/inventory",
      },
      {
        title: "Auctions",
        icon: Package,
        href: "/auctions",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Moderation",
        icon: Shield,
        href: "/admin/moderation",
      },
      {
        title: "Settings",
        icon: Settings,
        href: "/admin/settings",
      },
    ],
  },
];

const userNavigation = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
      },
      {
        title: "My Bids",
        icon: Gavel,
        href: "/dashboard/bids",
      },
    ],
  },
  {
    label: "Auctions",
    items: [
      {
        title: "My Listings",
        icon: Package,
        href: "/dashboard/listings",
      },
      {
        title: "Watchlist",
        icon: Heart,
        href: "/dashboard/watchlist",
      },
      {
        title: "History",
        icon: History,
        href: "/dashboard/history",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
      },
    ],
  },
];

const SidebarNav: FC<SidebarNavProps> = ({ isAdmin = false }) => {
  const pathname = usePathname();
  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          {isAdmin ? (
            <>
              <Shield className="h-6 w-6" />
              <span className="font-semibold">Admin Panel</span>
            </>
          ) : (
            <>
              <Package className="h-6 w-6" />
              <span className="font-semibold">Auction Hub</span>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <a href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarNav;
