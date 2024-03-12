/** Shown when a live client ID is configured but this tab has no session yet. */
export const ConnectPrompt = () => (
  <section className="max-w-xl space-y-4 rounded-lg border border-line bg-surface p-6">
    <h2 className="font-display text-xl font-semibold">Connect to browse</h2>
    <p className="text-muted">
      This build is configured for a live account. Use “Connect Spotify
      account” above to sign in with authorization code and PKCE; no client
      secret is involved and tokens stay in this tab’s session storage.
    </p>
    <p className="text-sm text-muted">
      Leave <code className="text-paper">NEXT_PUBLIC_SPOTIFY_CLIENT_ID</code>{" "}
      empty to use the offline demo catalogue instead.
    </p>
  </section>
);
