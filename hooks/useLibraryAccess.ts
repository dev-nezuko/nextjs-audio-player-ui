import { isDemoMode } from "@/services/tracks.service";
import { useIsAuthenticated } from "./useIsAuthenticated";

/** The demo catalogue is always browsable; the live API needs a session token. */
export const useLibraryAccess = () => {
  const isAuthenticated = useIsAuthenticated();
  return isDemoMode() || isAuthenticated;
};
