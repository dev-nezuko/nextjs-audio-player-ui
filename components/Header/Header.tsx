"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { useRouter } from "next/navigation";

import { ComponentProps } from "@/types/sharedTypes";
import { handleLogout, redirectToSpotifyLogin } from "@/utils/auth.utils";
import { Button } from "../Button/Button";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

export const Header: React.FC<ComponentProps> = ({ children, className }) => {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div
      className={twMerge(
        "h-fit bg-gradient-to-b from-emerald-800 p-6",
        className,
      )}
    >
      <div className="w-full mb-4 flex items-start justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <Button
            aria-label="Back"
            onClick={() => router.back()}
            icon={RxCaretLeft}
            variant="round"
            className="w-10 h-10"
          />
          <Button
            aria-label="Forward"
            onClick={() => router.forward()}
            icon={RxCaretRight}
            variant="round"
            className="w-10 h-10"
          />
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <Button
            aria-label="Home"
            onClick={() => router.push("/")}
            icon={HiHome}
            variant="round"
            className="w-10 h-10"
          />
          <Button
            aria-label="Search"
            onClick={() => router.push("/search")}
            icon={BiSearch}
            variant="round"
            className="w-10 h-10"
          />
        </div>
        {children}
        <div className="flex justify-between items-center gap-x-4">
          {isAuthenticated ? (
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button
              disabled={!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}
              onClick={() =>
                redirectToSpotifyLogin().catch(() =>
                  setError(
                    "Check the public client ID and redirect URL configuration.",
                  ),
                )
              }
            >
              {process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
                ? "Connect Spotify"
                : "Configure Spotify client"}
            </Button>
          )}
        </div>
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
  );
};
