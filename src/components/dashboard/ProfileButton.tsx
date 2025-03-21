"use client";

import React, { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, LayoutDashboard, Home } from "lucide-react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ProfileButton: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const user = session?.user;

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline-block">
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isDashboard ? (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
