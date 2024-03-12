"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";

import { MenuBox } from "./MenuBox";
import { MenuItem } from "./MenuItem";
import { Library } from "../Library/Library";
import { IconType } from "react-icons";

interface Route {
  icon: IconType;
  label: string;
  href: string;
}

const routes: Route[] = [
  {
    icon: HiHome,
    label: "Home",
    href: "/",
  },
  {
    icon: BiSearch,
    label: "Search",
    href: "/search",
  },
];

export const Sidebar: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  const isRouteActive = (route: Route) => pathname === route.href;

  return (
    <div className="flex h-full">
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <MenuBox className="flex flex-col gap-y-4 px-5 py-4">
          {routes.map((route) => (
            <MenuItem
              key={route.label}
              active={isRouteActive(route)}
              {...route}
            />
          ))}
        </MenuBox>
        <MenuBox className="overflow-y-auto h-full">
          <Library />
        </MenuBox>
      </div>

      <main className="h-full flex-1 min-w-0 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
};
