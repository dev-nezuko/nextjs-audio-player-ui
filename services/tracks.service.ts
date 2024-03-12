import { baseService } from "./api.service";
import type { SavedTracksResponse, SearchResponse } from "../types/sharedTypes";

export const searchTracks = (searchQuery: string) =>
  baseService.get<SearchResponse>(
    `/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`,
  );

export const saveTrack = (id: string) =>
  baseService.put<null>(`/v1/me/tracks?ids=${encodeURIComponent(id)}`);

export const getSavedTracks = () =>
  baseService.get<SavedTracksResponse>(`/v1/me/tracks`);
