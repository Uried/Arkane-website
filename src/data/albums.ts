import { releases } from "./releases";

/**
 * @deprecated Compatibility shim for `SpotifyAlbums` and `site.ts` —
 * canonical release data now lives in `./releases.ts`. Kept until every
 * consumer reads `ReleaseEntry` directly.
 */
export interface SpotifyAlbum {
  id: string;
  title: string;
  artist?: string;
  coverUrl: string;
  coverAlt: string;
  spotifyUrl: string;
  embedUrl: string;
  spotifyUri: string;
}

export const spotifyAlbums: SpotifyAlbum[] = releases
  .filter((r) => r.spotifyUrl && r.embedUrl && r.spotifyUri)
  .map((r) => ({
    id: r.id,
    title: r.title,
    artist: r.artistName,
    coverUrl: r.coverUrl,
    coverAlt: r.coverAlt,
    spotifyUrl: r.spotifyUrl as string,
    embedUrl: r.embedUrl as string,
    spotifyUri: r.spotifyUri as string,
  }));
