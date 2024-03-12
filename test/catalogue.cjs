const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

function storage() {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), removeItem: (k) => data.delete(k) };
}
global.window = { location: { origin: 'http://127.0.0.1:3000', href: '' }, dispatchEvent: () => {} };

const tracks = require('../.test-build/services/tracks.service.js');
const { DEMO_TRACKS } = require('../.test-build/services/demo.catalogue.js');
const { transformTrack } = require('../.test-build/utils/helper.utils.js');

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  global.sessionStorage = storage();
  global.localStorage = storage();
  global.fetch = async () => { throw Error('Unexpected network access'); };
});

test('without a client ID the app is in demo mode', () => {
  assert.equal(tracks.isDemoMode(), true);
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = 'offline-client';
  assert.equal(tracks.isDemoMode(), false);
});

test('demo catalogue uses unique ids and locally drawn artwork only', () => {
  const ids = new Set(DEMO_TRACKS.map((t) => t.id));
  assert.equal(ids.size, DEMO_TRACKS.length);
  for (const t of DEMO_TRACKS) assert.match(t.album.images[0].url, /^data:image\/svg\+xml,/);
});

test('featured tracks return the whole catalogue in API shape', async () => {
  const res = await tracks.getFeaturedTracks();
  assert.equal(res.tracks.items.length, DEMO_TRACKS.length);
});

test('demo search matches title, artist or album case-insensitively', async () => {
  const byTitle = await tracks.searchTracks('KELP');
  assert.deepEqual(byTitle.tracks.items.map((t) => t.name), ['Lanterns Over Kelp Street']);
  const byArtist = await tracks.searchTracks('juniper ferro');
  assert.equal(byArtist.tracks.items.length, 2);
  const byAlbum = await tracks.searchTracks('crossings');
  assert.ok(byAlbum.tracks.items.every((t) => t.album.name === 'Crossings'));
});

test('blank or unmatched demo searches return no tracks', async () => {
  assert.equal((await tracks.searchTracks('   ')).tracks.items.length, 0);
  assert.equal((await tracks.searchTracks('no such song')).tracks.items.length, 0);
});

test('saving a demo track puts it first in the library without duplicates', async () => {
  const before = (await tracks.getSavedTracks()).items.map((i) => i.track.id);
  assert.equal(before.length, 3);
  await tracks.saveTrack('demo-01');
  await tracks.saveTrack(before[1]);
  const after = (await tracks.getSavedTracks()).items.map((i) => i.track.id);
  assert.equal(after.length, 4);
  assert.deepEqual(after.slice(0, 2), [before[1], 'demo-01']);
});

test('saving an unknown id fails and leaves the library unchanged', async () => {
  await assert.rejects(tracks.saveTrack('not-a-track'));
  assert.equal((await tracks.getSavedTracks()).items.length, 3);
});

test('corrupt saved-library storage falls back to the default selection', async () => {
  sessionStorage.setItem('demo_saved_track_ids', '{not json');
  assert.equal((await tracks.getSavedTracks()).items.length, 3);
});

test('connected mode searches the live API with an encoded query', async () => {
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = 'offline-client';
  sessionStorage.setItem('access_token', 'offline-access');
  let requested;
  global.fetch = async (url) => { requested = url; return new Response(JSON.stringify({ tracks: { items: [] } })); };
  await tracks.searchTracks('a&b');
  assert.equal(requested, 'https://api.spotify.com/v1/search?q=a%26b&type=track');
});

test('transformTrack falls back to placeholder artwork and artist', () => {
  const flat = transformTrack({ id: 'x', name: 'N', uri: 'u', artists: [], album: { name: 'A', images: [] } });
  assert.equal(flat.image, '/track-placeholder.svg');
  assert.equal(flat.artist, 'Unknown artist');
});
