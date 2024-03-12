import type {
  SavedTracksResponse,
  SearchResponse,
  TrackType,
} from "../types/sharedTypes";

/*
 * Offline stand-in for the music API, used whenever no public client ID is
 * configured. Every track, artist and album here is invented, and artwork is
 * drawn locally, so the demo never contacts a provider or shows real covers.
 */

const SAVED_KEY = "demo_saved_track_ids";
const DEFAULT_SAVED = ["demo-03", "demo-07", "demo-11"];
const LATENCY_MS = 250;

const RAW: [title: string, artist: string, album: string, hue: number][] = [
  ["Lanterns Over Kelp Street", "The Quiet Harbour", "Tidewater Sketches", 28],
  ["Copper Wire Lullaby", "Juniper Ferro", "Small Hours Radio", 14],
  ["Second Floor Sunrise", "Saltglass Choir", "Rooms We Rented", 42],
  ["Night Ferry Waltz", "Halden & the Night Ferries", "Crossings", 205],
  ["Ochre Static", "Tamsin Reel", "Field Recordings Vol. 2", 33],
  ["Paper Planets", "The Low Orbit Club", "Gravity Is Optional", 260],
  ["Rain on the Allotment", "Marisol Vane", "Greenhouse Tapes", 120],
  ["Slow Escalator", "Juniper Ferro", "Small Hours Radio", 8],
  ["Carousel After Closing", "Saltglass Choir", "Rooms We Rented", 340],
  ["Pinewood Telegraph", "Odd Lantern Society", "Morse for Beginners", 95],
  ["Velvet Timetable", "The Low Orbit Club", "Gravity Is Optional", 280],
  ["Harbour Lights Reprise", "The Quiet Harbour", "Tidewater Sketches", 190],
  ["Clockwork Orchard", "Marisol Vane", "Greenhouse Tapes", 75],
  ["Last Tram Home", "Halden & the Night Ferries", "Crossings", 220],
  ["Brass Weather", "Odd Lantern Society", "Morse for Beginners", 48],
  ["Honey in the Amplifier", "Tamsin Reel", "Field Recordings Vol. 2", 18],
];

function artwork(title: string, hue: number) {
  const offset = (title.length * 37) % 100;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" fill="hsl(${hue} 45% 22%)"/>` +
    `<circle cx="${30 + offset / 3}" cy="62" r="34" fill="hsl(${hue} 70% 58%)"/>` +
    `<rect x="0" y="${70 - offset / 5}" width="100" height="8" fill="hsl(${(hue + 40) % 360} 60% 80%)"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const DEMO_TRACKS: TrackType[] = RAW.map(
  ([name, artist, album, hue], index) => {
    const id = `demo-${String(index + 1).padStart(2, "0")}`;
    return {
      id,
      name,
      uri: `demo:track:${id}`,
      artists: [{ name: artist }],
      album: { name: album, images: [{ url: artwork(name, hue) }] },
    };
  },
);

const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

function readSavedIds(): string[] {
  const stored = sessionStorage.getItem(SAVED_KEY);
  if (!stored) return DEFAULT_SAVED;
  try {
    const ids = JSON.parse(stored);
    return Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : [];
  } catch {
    return DEFAULT_SAVED;
  }
}

export async function demoSearch(query: string): Promise<SearchResponse> {
  await delay();
  const needle = query.trim().toLowerCase();
  const items = needle
    ? DEMO_TRACKS.filter((track) =>
        [track.name, track.artists[0].name, track.album.name].some((field) =>
          field.toLowerCase().includes(needle),
        ),
      )
    : [];
  return { tracks: { items } };
}

export async function demoFeatured(): Promise<SearchResponse> {
  await delay();
  return { tracks: { items: DEMO_TRACKS } };
}

export async function demoSavedTracks(): Promise<SavedTracksResponse> {
  await delay();
  const byId = new Map(DEMO_TRACKS.map((track) => [track.id, track]));
  const items = readSavedIds()
    .map((id) => byId.get(id))
    .filter((track): track is TrackType => Boolean(track))
    .reverse()
    .map((track) => ({ track }));
  return { items };
}

export async function demoSaveTrack(id: string): Promise<null> {
  await delay();
  if (!DEMO_TRACKS.some((track) => track.id === id))
    throw new Error(`Unknown demo track ${id}`);
  const ids = readSavedIds().filter((savedId) => savedId !== id);
  sessionStorage.setItem(SAVED_KEY, JSON.stringify([...ids, id]));
  return null;
}
