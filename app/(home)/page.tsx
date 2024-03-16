"use client";

import { Header } from "@/components/Header/Header";
import { TracksLoader } from "@/components/SkeletonLoader/TracksLoader";
import { Track } from "@/components/Track/Track";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { searchTracks } from "@/services/tracks.service";
import { FilteredTrack } from "@/types/sharedTypes";
import { transformTrack } from "@/utils/helper.utils";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const isAuthenticated = useIsAuthenticated();
  const isMounted = useRef(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<FilteredTrack[] | undefined>();

  useEffect(() => {
    if (!isAuthenticated || isMounted.current) {
      return;
    }

    setIsLoading(true);
    searchTracks("track")
      .then((res) => {
        setTracks(res.tracks.items.map(transformTrack));
      })
      .catch(() =>
        setError("Tracks could not be loaded. Reconnect or try again later."),
      )
      .finally(() => setIsLoading(false));

    isMounted.current = true;
  }, [isAuthenticated, tracks]);

  if (!isAuthenticated) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header />
        <section className="mx-8 max-w-xl space-y-5 pb-10">
          <p className="text-emerald-300 text-sm uppercase tracking-widest">
            Next.js integration prototype
          </p>
          <h1 className="font-bold text-3xl">
            Your Spotify library, without the clutter
          </h1>
          <p className="text-neutral-300">
            Connect a configured Spotify app to search tracks and browse saved
            songs. This prototype does not play audio.
          </p>
          <ol className="list-decimal pl-5 text-neutral-400 space-y-2">
            <li>Configure a public app client ID and loopback redirect.</li>
            <li>Connect using authorization code with PKCE.</li>
            <li>Search tracks and save them to your library.</li>
          </ol>
          <p className="text-sm text-neutral-400">
            No client secret is needed. Tokens stay in this tab’s session
            storage.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header />
      <h1 className="mx-8 mb-10 font-bold text-3xl">Welcome Back!</h1>
      {error && (
        <p role="alert" className="mx-8 text-red-300">
          {error}
        </p>
      )}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-10">
          {Array.from({ length: 10 }, (loader) => (
            <TracksLoader key={`loader-${loader}`} />
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto h-full p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
            {tracks?.map((searchedTrack) => (
              <Track track={searchedTrack} key={searchedTrack.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
