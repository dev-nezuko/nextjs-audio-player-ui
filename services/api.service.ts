import { refreshSpotifyToken } from "./auth.service";

async function request(
  isAuthUrl: boolean,
  method: string,
  endpoint: string,
  body?: any,
  retried = false,
): Promise<any> {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("access_token")
      : null;
  if (!isAuthUrl && !token) throw new Error("Sign in to use Spotify");
  const headers: Record<string, string> = {
    "Content-Type": isAuthUrl
      ? "application/x-www-form-urlencoded"
      : "application/json",
  };
  if (!isAuthUrl) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(
    (isAuthUrl ? "https://accounts.spotify.com" : "https://api.spotify.com") +
      endpoint,
    {
      method,
      headers,
      body:
        body == null
          ? undefined
          : isAuthUrl
            ? new URLSearchParams(body)
            : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (response.status === 401 && !isAuthUrl && !retried) {
    await refreshSpotifyToken();
    return request(isAuthUrl, method, endpoint, body, true);
  }
  if (!response.ok)
    throw new Error(`Spotify request failed (${response.status})`);
  if (response.status === 204) return null;
  return response.json();
}
const service = (auth: boolean) => ({
  get: (endpoint: string, body?: any) => request(auth, "GET", endpoint, body),
  post: (endpoint: string, body?: any) => request(auth, "POST", endpoint, body),
  put: (endpoint: string, body?: any) => request(auth, "PUT", endpoint, body),
  delete: (endpoint: string, body?: any) =>
    request(auth, "DELETE", endpoint, body),
});
export const baseService = service(false);
export const authService = service(true);
