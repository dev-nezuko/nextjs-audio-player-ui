"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { BiLibrary, BiSearch } from "react-icons/bi";
import { PiVinylRecord } from "react-icons/pi";

import { Header } from "../Header/Header";
import { Library } from "../Library/Library";
import { MenuBox } from "./MenuBox";
import { MenuItem } from "./MenuItem";

interface Route {
  icon: IconType;
  label: string;
  href: string;
}

const routes: Route[] = [
  { icon: PiVinylRecord, label: "Browse", href: "/" },
  { icon: BiSearch, label: "Search", href: "/search" },
  { icon: BiLibrary, label: "Library", href: "/library" },
];

const Wordmark = () => (
  <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
    Crate<span className="text-accent">.</span>
  </Link>
);

export const Sidebar: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[17rem_minmax(0,1fr)]">
      <aside
        aria-label="Navigation and saved tracks"
        className="hidden md:flex md:sticky md:top-0 md:h-dvh flex-col gap-3 border-r border-line p-3"
      >
        <div className="px-3 pt-3 pb-1">
          <Wordmark />
        </div>
        <nav aria-label="Primary">
          <MenuBox className="flex flex-col gap-1 p-2">
            {routes.map((route) => (
              <MenuItem
                key={route.href}
                active={pathname === route.href}
                {...route}
              />
            ))}
          </MenuBox>
        </nav>
        <MenuBox className="min-h-0 flex-1 overflow-y-auto">
          <Library />
        </MenuBox>
      </aside>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-10">
          <div className="md:hidden">
            <Wordmark />
          </div>
          <Header className="ml-auto" />
        </div>
        <nav
          aria-label="Primary"
          className="flex gap-1 border-b border-line px-2 py-2 md:hidden"
        >
          {routes.map((route) => (
            <MenuItem
              key={route.href}
              active={pathname === route.href}
              className="flex-1 justify-center text-sm"
              {...route}
            />
          ))}
        </nav>
        <main id="main" className="flex-1 px-4 py-8 md:px-10">
          {children}
        </main>
        <footer className="px-4 pb-6 text-xs text-muted md:px-10">
          Crate is a browsing prototype: it searches and saves tracks but does
          not play audio.
        </footer>
      </div>
    </div>
  );
};
