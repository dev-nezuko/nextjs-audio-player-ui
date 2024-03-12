"use client";

import { useState } from "react";

import { Header } from "@/components/Header/Header";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { TracksLoader } from "@/components/SkeletonLoader/TracksLoader";
import { Track } from "@/components/Track/Track";
import { useLibraryAccess } from "@/hooks/useLibraryAccess";
import { useTrackSearch } from "@/hooks/useTrackSearch";

const SearchForm = () => {
  const canBrowse = useLibraryAccess();
  const [query, setQuery] = useState("");
  const {
    tracks: searchedTracks,
    isLoading,
    error,
  } = useTrackSearch(query, { enabled: canBrowse, delayMs: 400 });

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <SearchBar
          value={query}
          onChange={setQuery}
          disabled={!canBrowse}
          error={error}
        />
      </Header>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-10">
          {Array.from({ length: 8 }, (_, index) => (
            <TracksLoader key={`track-loader-${index}`} />
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto h-full p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
            {searchedTracks.map((searchedTrack) => (
              <Track track={searchedTrack} key={searchedTrack.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
