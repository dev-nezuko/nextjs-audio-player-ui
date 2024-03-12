"use client";

import { useLibraryAccess } from "@/hooks/useLibraryAccess";
import { getSavedTracks, saveTrack } from "@/services/tracks.service";
import { FilteredTrack } from "@/types/sharedTypes";
import { transformTrack } from "@/utils/helper.utils";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface LibraryContextProps {
  tracks: FilteredTrack[] | undefined;
  isLoading: boolean;
  error: string;
  addToLibrary: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextProps | undefined>(
  undefined,
);

interface LibraryProviderProps {
  children: ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({
  children,
}) => {
  const canBrowse = useLibraryAccess();
  const [reloadCount, setReloadCount] = useState(0);
  const [saveError, setSaveError] = useState("");
  const [loaded, setLoaded] = useState<{
    tracks?: FilteredTrack[];
    error?: string;
  }>({});

  useEffect(() => {
    if (!canBrowse) return;
    let active = true;
    getSavedTracks()
      .then((res) => {
        if (active)
          setLoaded({ tracks: res.items.map((item) => transformTrack(item.track)) });
      })
      .catch(() => {
        if (active) setLoaded({ error: "Saved songs could not be loaded." });
      });
    return () => {
      active = false;
    };
  }, [canBrowse, reloadCount]);

  const addToLibrary = useCallback(async (id: string) => {
    setSaveError("");
    try {
      await saveTrack(id);
      setReloadCount((count) => count + 1);
    } catch {
      setSaveError("Track could not be saved. Try reconnecting.");
    }
  }, []);

  const value: LibraryContextProps = canBrowse
    ? {
        tracks: loaded.tracks,
        isLoading: !loaded.tracks && !loaded.error,
        error: saveError || loaded.error || "",
        addToLibrary,
      }
    : { tracks: [], isLoading: false, error: "", addToLibrary };

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextProps => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
