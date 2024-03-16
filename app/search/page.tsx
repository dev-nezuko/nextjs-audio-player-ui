"use client";

import { useState } from "react";

import { Header } from "@/components/Header/Header";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { TracksLoader } from "@/components/SkeletonLoader/TracksLoader";
import { Track } from "@/components/Track/Track";
import { FilteredTrack } from "@/types/sharedTypes";

const SearchForm = () => {
  const [isLoading, setIsloading] = useState(false);
  const [searchedTracks, setSearchedTracks] = useState<
    FilteredTrack[] | undefined
  >();

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <SearchBar
          setSearchedTracks={setSearchedTracks}
          setIsLoading={setIsloading}
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
            {searchedTracks?.map((searchedTrack, index) => (
              <Track track={searchedTrack} key={`searched-track-${index}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
