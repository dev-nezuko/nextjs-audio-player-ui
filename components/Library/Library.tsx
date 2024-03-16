"use client";

import { TbPlaylist } from "react-icons/tb";
import { SavedTrack } from "../Track/SavedTrack";
import { SavedTrackLoader } from "../SkeletonLoader/SavedTrackLoader";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { useLibrary } from "@/contexts/LibraryContext";

export const Library = () => {
  const isAuthenticated = useIsAuthenticated();
  const { tracks, isLoading, error } = useLibrary();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={25} />
          <p className="text-neutral-400 text-md font-medium">My Library</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 mt-3 px-5 font-bold">
        Saved Songs
      </div>
      {error && (
        <p role="alert" className="px-5 text-red-300">
          {error}
        </p>
      )}
      <div className="overflow-y-auto h-full p-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 10 }, (_, index) => (
              <SavedTrackLoader key={`saved-track-loader-${index}`} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tracks?.map((savedTrack, index) => (
              <SavedTrack track={savedTrack} key={`saved-track-${index}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
