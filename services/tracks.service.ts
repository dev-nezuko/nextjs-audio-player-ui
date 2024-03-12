import { baseService } from "./api.service";
import {
  demoFeatured,
  demoSaveTrack,
  demoSavedTracks,
  demoSearch,
} from "./demo.catalogue";
import type { SavedTracksResponse, SearchResponse } from "../types/sharedTypes";

/** Without a public client ID the app runs entirely on the offline demo catalogue. */
export const isDemoMode = () => !process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

export const searchTracks = (searchQuery: string) =>
  isDemoMode()
    ? demoSearch(searchQuery)
    : baseService.get<SearchResponse>(
        `/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`,
      );

export const getFeaturedTracks = () =>
  isDemoMode() ? demoFeatured() : searchTracks("track");

export const saveTrack = (id: string) =>
  isDemoMode()
    ? demoSaveTrack(id)
    : baseService.put<null>(`/v1/me/tracks?ids=${encodeURIComponent(id)}`);

export const getSavedTracks = () =>
  isDemoMode()
    ? demoSavedTracks()
    : baseService.get<SavedTracksResponse>(`/v1/me/tracks`);
