"use client";

import Link from "next/link";

import { useLibrary } from "@/contexts/LibraryContext";
import { useLibraryAccess } from "@/hooks/useLibraryAccess";
import { SavedTrackLoader } from "../SkeletonLoader/SavedTrackLoader";
import { SavedTrack } from "../Track/SavedTrack";

/** Compact saved-tracks list for the desktop sidebar. */
export const Library = () => {
  const canBrowse = useLibraryAccess();
  const { tracks, isLoading, error } = useLibrary();

  return (
    <section aria-labelledby="sidebar-library" className="flex flex-col p-3">
      <div className="flex items-baseline justify-between px-2 pb-2">
        <h2 id="sidebar-library" className="font-display text-lg font-semibold">
          Saved tracks
        </h2>
        {canBrowse && tracks && (
          <Link href="/library" className="text-xs text-muted hover:text-paper">
            {tracks.length} saved
          </Link>
        )}
      </div>
      {!canBrowse ? (
        <p className="px-2 text-sm text-muted">
          Connect an account to see what you have saved.
        </p>
      ) : error ? (
        <p role="alert" className="px-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
      {isLoading ? (
        <div role="status" aria-label="Loading saved tracks">
          {Array.from({ length: 5 }, (_, index) => (
            <SavedTrackLoader key={`saved-loader-${index}`} />
          ))}
        </div>
      ) : canBrowse && tracks?.length === 0 ? (
        <p className="px-2 text-sm text-muted">
          Nothing saved yet. Use Save on any track.
        </p>
      ) : (
        <ul className="flex flex-col">
          {tracks?.map((track) => (
            <SavedTrack track={track} key={track.id} />
          ))}
        </ul>
      )}
    </section>
  );
};
