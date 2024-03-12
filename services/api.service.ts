import { refreshSpotifyToken } from "./auth.service";

type FormBody = Record<string, string>;

async function request<T>(
  isAuthUrl: boolean,
  method: string,
  endpoint: string,
  body?: FormBody,
  retried = false,
): Promise<T> {
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
    return request<T>(isAuthUrl, method, endpoint, body, true);
  }
  if (!response.ok)
    throw new Error(`Spotify request failed (${response.status})`);
  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

const service = (auth: boolean) => ({
  get: <T>(endpoint: string) => request<T>(auth, "GET", endpoint),
  post: <T>(endpoint: string, body?: FormBody) =>
    request<T>(auth, "POST", endpoint, body),
  put: <T>(endpoint: string, body?: FormBody) =>
    request<T>(auth, "PUT", endpoint, body),
  delete: <T>(endpoint: string) => request<T>(auth, "DELETE", endpoint),
});
export const baseService = service(false);
export const authService = service(true);
