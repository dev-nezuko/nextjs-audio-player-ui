"use client";

import Image from "next/image";

import { ConnectPrompt } from "@/components/ConnectPrompt/ConnectPrompt";
import { PageHeading } from "@/components/PageHeading/PageHeading";
import { SaveButton } from "@/components/Track/Track";
import { TrackList } from "@/components/TrackList/TrackList";
import { useLibraryAccess } from "@/hooks/useLibraryAccess";
import { useTrackSearch } from "@/hooks/useTrackSearch";
import { getFeaturedTracks, isDemoMode } from "@/services/tracks.service";
import { FilteredTrack } from "@/types/sharedTypes";

const Pick = ({ track }: { track: FilteredTrack }) => (
  <section
    aria-labelledby="pick-title"
    className="mb-10 flex flex-col gap-5 rounded-lg border border-line bg-surface p-5 sm:flex-row sm:items-center"
  >
    <div className="relative aspect-square w-full max-w-40 shrink-0 overflow-hidden rounded-md shadow-lg shadow-black/40">
      <Image src={track.image} alt="" fill sizes="160px" className="object-cover" priority />
    </div>
    <div className="min-w-0 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Top of the crate
      </p>
      <h2 id="pick-title" className="font-display text-2xl font-semibold">
        {track.name}
      </h2>
      <p className="text-muted">
        {track.artist} · <span className="font-display italic">{track.albumName}</span>
      </p>
      <SaveButton track={track} alwaysShowLabel />
    </div>
  </section>
);

export default function Home() {
  const canBrowse = useLibraryAccess();
  const { tracks, isLoading, error } = useTrackSearch("featured", {
    enabled: canBrowse,
    load: getFeaturedTracks,
  });

  return (
    <>
      <PageHeading eyebrow="Browse" title="Dig through the crate">
        {isDemoMode()
          ? "An offline catalogue of invented tracks. Save the ones you like; your library lasts for this browser tab."
          : "Tracks from your connected account. Save the ones you like to your library."}
      </PageHeading>
      {!canBrowse ? (
        <ConnectPrompt />
      ) : (
        <>
          {error && (
            <p role="alert" className="mb-6 text-danger">
              {error}
            </p>
          )}
          {!isLoading && tracks[0] && <Pick track={tracks[0]} />}
          {!isLoading && !error && tracks.length === 0 ? (
            <p className="text-muted">No tracks to show yet.</p>
          ) : (
            <TrackList
              tracks={tracks.slice(1)}
              isLoading={isLoading}
              label="Catalogue tracks"
            />
          )}
        </>
      )}
    </>
  );
}
