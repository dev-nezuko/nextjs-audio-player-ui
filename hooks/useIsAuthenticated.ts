import { useSyncExternalStore } from "react";

const LEGACY_KEYS = ["access_token", "refresh_token", "code_verifier"];

function subscribe(onChange: () => void) {
  // Tokens used to live in localStorage; purge them so they cannot outlive the tab.
  for (const key of LEGACY_KEYS) localStorage.removeItem(key);
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

const hasSessionToken = () => Boolean(sessionStorage.getItem("access_token"));

export const useIsAuthenticated = () =>
  useSyncExternalStore(subscribe, hasSessionToken, () => false);
