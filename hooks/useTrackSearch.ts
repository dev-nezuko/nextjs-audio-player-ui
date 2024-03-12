import { useEffect, useState } from "react";

import { searchTracks } from "@/services/tracks.service";
import { FilteredTrack, SearchResponse } from "@/types/sharedTypes";
import { transformTrack } from "@/utils/helper.utils";

interface SearchResult {
  query: string;
  tracks?: FilteredTrack[];
  error?: string;
}

const NO_RESULTS: FilteredTrack[] = [];

/**
 * Runs `load(query)` once `enabled`, waiting `delayMs` so typing does not fire
 * a request per keystroke. `load` must be a stable (module-level) function.
 */
export function useTrackSearch(
  query: string,
  {
    enabled,
    delayMs = 0,
    load = searchTracks,
  }: {
    enabled: boolean;
    delayMs?: number;
    load?: (query: string) => Promise<SearchResponse>;
  },
) {
  const trimmed = query.trim();
  const [result, setResult] = useState<SearchResult>({ query: "" });

  useEffect(() => {
    if (!enabled || !trimmed) return;
    let active = true;
    const timer = setTimeout(() => {
      load(trimmed)
        .then((response) => {
          if (active)
            setResult({
              query: trimmed,
              tracks: response.tracks.items.map(transformTrack),
            });
        })
        .catch(() => {
          if (active)
            setResult({
              query: trimmed,
              error: "Search failed. Reconnect or try again later.",
            });
        });
    }, delayMs);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [enabled, trimmed, delayMs, load]);

  if (!enabled || !trimmed)
    return { tracks: NO_RESULTS, isLoading: false, error: "" };
  const isCurrent = result.query === trimmed;
  return {
    tracks: (isCurrent && result.tracks) || NO_RESULTS,
    isLoading: !isCurrent,
    error: (isCurrent && result.error) || "",
  };
}
