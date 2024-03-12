"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { isDemoMode } from "@/services/tracks.service";
import { ComponentProps } from "@/types/sharedTypes";
import { handleLogout, redirectToSpotifyLogin } from "@/utils/auth.utils";
import { Button } from "../Button/Button";

/** Account controls: a demo label, or connect/disconnect for the live API. */
export const Header: React.FC<ComponentProps> = ({ className }) => {
  const isAuthenticated = useIsAuthenticated();
  const [error, setError] = useState("");

  return (
    <div className={twMerge("flex flex-col items-end gap-1", className)}>
      {isDemoMode() ? (
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
          Demo catalogue · offline
        </span>
      ) : isAuthenticated ? (
        <Button variant="secondary" onClick={handleLogout}>
          Disconnect
        </Button>
      ) : (
        <Button
          onClick={() =>
            redirectToSpotifyLogin().catch(() =>
              setError(
                "Check the public client ID and redirect URL configuration.",
              ),
            )
          }
        >
          Connect Spotify account
        </Button>
      )}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};
