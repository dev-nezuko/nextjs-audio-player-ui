import { authService } from "./api.service";
import { consumeOAuthTransaction, handleLogout } from "../utils/auth.utils";

function storeTokens(response: any) {
  if (typeof response?.access_token !== "string" || !response.access_token)
    throw new Error("Invalid token response");
  sessionStorage.setItem("access_token", response.access_token);
  if (typeof response.refresh_token === "string" && response.refresh_token)
    sessionStorage.setItem("refresh_token", response.refresh_token);
  window.dispatchEvent(new Event("storage"));
}

export const getToken = async (code: string, state: string | null) => {
  const transaction = consumeOAuthTransaction(state);
  const response = await authService.post("/api/token", {
    grant_type: "authorization_code",
    code,
    redirect_uri: transaction.redirectUri,
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "",
    code_verifier: transaction.verifier,
  });
  storeTokens(response);
};

let refreshInFlight: Promise<void> | null = null;
export const refreshSpotifyToken = (): Promise<void> => {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const refreshToken = sessionStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("Sign in again");
    try {
      const response = await authService.post("/api/token", {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "",
      });
      storeTokens(response);
    } catch {
      handleLogout();
      throw new Error("Sign in again");
    }
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
};
