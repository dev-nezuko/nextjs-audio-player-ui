"use client";

import { useState } from "react";

import { ConnectPrompt } from "@/components/ConnectPrompt/ConnectPrompt";
import { PageHeading } from "@/components/PageHeading/PageHeading";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { TrackList } from "@/components/TrackList/TrackList";
import { useLibraryAccess } from "@/hooks/useLibraryAccess";
import { useTrackSearch } from "@/hooks/useTrackSearch";
import { isDemoMode } from "@/services/tracks.service";

const SearchPage = () => {
  const canBrowse = useLibraryAccess();
  const [query, setQuery] = useState("");
  const { tracks, isLoading, error } = useTrackSearch(query, {
    enabled: canBrowse,
    delayMs: 400,
  });
  const trimmed = query.trim();

  return (
    <>
      <PageHeading eyebrow="Search" title="Find a track" />
      {!canBrowse ? (
        <ConnectPrompt />
      ) : (
        <>
          <SearchBar value={query} onChange={setQuery} />
          <div className="mt-8" aria-live="polite">
            {error ? (
              <p role="alert" className="text-danger">
                {error}
              </p>
            ) : !trimmed ? (
              <p className="text-muted">
                Start typing to search by title, artist or album
                {isDemoMode() && " (try “harbour” or “Juniper”)"}.
              </p>
            ) : !isLoading && tracks.length === 0 ? (
              <p className="text-muted">Nothing matches “{trimmed}”.</p>
            ) : (
              <TrackList
                tracks={tracks}
                isLoading={isLoading}
                label={`Results for ${trimmed}`}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SearchPage;
