import { baseService } from "./api.service";

export const searchTracks = async (searchQuery: string) => {
  return baseService.get(
    `/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`,
  );
};

export const saveTrack = async (id: string) => {
  return baseService.put(`/v1/me/tracks?ids=${encodeURIComponent(id)}`);
};

export const getSavedTracks = async () => {
  return baseService.get(`/v1/me/tracks`);
};
