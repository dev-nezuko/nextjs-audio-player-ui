const TRANSACTION_KEY = "spotify_oauth_transaction";
const SESSION_KEYS = [
  "access_token",
  "refresh_token",
  "code_verifier",
  TRANSACTION_KEY,
];

function randomValue(bytes: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
}

export function consumeOAuthTransaction(state: string | null) {
  const stored = sessionStorage.getItem(TRANSACTION_KEY);
  sessionStorage.removeItem(TRANSACTION_KEY);
  if (!stored) throw new Error("Start sign-in again");
  const transaction = JSON.parse(stored);
  const age = Date.now() - transaction.created;
  if (
    !state ||
    state !== transaction.state ||
    !transaction.verifier ||
    !Number.isFinite(age) ||
    age < 0 ||
    age > 10 * 60 * 1000
  )
    throw new Error("Invalid or expired sign-in state");
  return transaction as { verifier: string; redirectUri: string };
}

export const redirectToSpotifyLogin = async () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  if (!clientId)
    throw new Error("Configure the public Spotify client ID before signing in");
  const origin = new URL(
    process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
  );
  if (
    origin.protocol !== "https:" &&
    !(
      origin.protocol === "http:" &&
      ["127.0.0.1", "[::1]"].includes(origin.hostname)
    )
  )
    throw new Error("Use HTTPS or an explicit loopback IP");
  const redirectUri = origin.origin + "/callback";
  const verifier = randomValue(32);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  const challenge = btoa(
    String.fromCharCode(...Array.from(new Uint8Array(digest))),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const state = randomValue(24);
  sessionStorage.setItem(
    TRANSACTION_KEY,
    JSON.stringify({ state, verifier, redirectUri, created: Date.now() }),
  );
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "user-library-read user-library-modify",
    redirect_uri: redirectUri,
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });
  window.location.href = "https://accounts.spotify.com/authorize?" + params;
};

export const handleLogout = () => {
  for (const key of SESSION_KEYS) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }
  window.dispatchEvent(new Event("storage"));
};
