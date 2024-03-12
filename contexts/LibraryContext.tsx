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
  useMemo,
} from "react";

interface LibraryContextProps {
  tracks: FilteredTrack[] | undefined;
  savedIds: ReadonlySet<string>;
  savingId: string | null;
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

const EMPTY: FilteredTrack[] = [];

export const LibraryProvider: React.FC<LibraryProviderProps> = ({
  children,
}) => {
  const canBrowse = useLibraryAccess();
  const [reloadCount, setReloadCount] = useState(0);
  const [savingId, setSavingId] = useState<string | null>(null);
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
          setLoaded({
            tracks: res.items.map((item) => transformTrack(item.track)),
          });
      })
      .catch(() => {
        if (active) setLoaded({ error: "Saved tracks could not be loaded." });
      })
      .finally(() => {
        if (active) setSavingId(null);
      });
    return () => {
      active = false;
    };
  }, [canBrowse, reloadCount]);

  const addToLibrary = useCallback(async (id: string) => {
    setSaveError("");
    setSavingId(id);
    try {
      await saveTrack(id);
      setReloadCount((count) => count + 1);
    } catch {
      setSavingId(null);
      setSaveError("Track could not be saved. Try reconnecting.");
    }
  }, []);

  const tracks = canBrowse ? loaded.tracks : EMPTY;
  const savedIds = useMemo(
    () => new Set((tracks ?? EMPTY).map((track) => track.id)),
    [tracks],
  );

  const value: LibraryContextProps = {
    tracks,
    savedIds,
    savingId,
    isLoading: canBrowse && !loaded.tracks && !loaded.error,
    error: canBrowse ? saveError || loaded.error || "" : "",
    addToLibrary,
  };

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
