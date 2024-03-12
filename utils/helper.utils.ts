import { TrackType } from "@/types/sharedTypes";

export const transformTrack = (track: TrackType) => ({
  id: track.id,
  name: track.name,
  uri: track.uri,
  image: track.album.images[0]?.url || "/track-placeholder.svg",
  albumName: track.album.name,
  artist: track.artists[0]?.name || "Unknown artist",
});

export const getRandomSearch = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz";

  const randomCharacter = characters.charAt(
    Math.floor(Math.random() * characters.length),
  );

  const randomSearch =
    Math.round(Math.random()) === 0
      ? randomCharacter + "%"
      : "%" + randomCharacter + "%";

  return randomSearch;
};
