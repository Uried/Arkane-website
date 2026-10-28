import abats5Cover from "../../assets/Abats5-cover-album.jpg";
import dossierNoirCover from "../../assets/Dossier-noir-cover.jpg";

/**
 * Albums available on Spotify with their official embed players.
 * Covers and artist names reuse the metadata already present in the project
 * (home releases). Extend this list as the catalog grows — the section
 * renders whatever is listed here.
 */
export interface SpotifyAlbum {
  id: string;
  title: string;
  /** Artist or project name as shown on the artwork, when known. */
  artist?: string;
  coverUrl: string;
  coverAlt: string;
  /** Public album page — external "open in Spotify" link. */
  spotifyUrl: string;
  /** Official embed URL (open.spotify.com/embed/...). */
  embedUrl: string;
  /** Spotify URI (spotify:album:…) for the iFrame API player. */
  spotifyUri: string;
}

export const spotifyAlbums: SpotifyAlbum[] = [
  {
    id: "abats-5",
    title: "Abats 5",
    coverUrl: abats5Cover,
    coverAlt: "Album cover — Abats 5",
    spotifyUrl: "https://open.spotify.com/album/6RSsaKMLPtOJT7iEkjnrbD",
    embedUrl:
      "https://open.spotify.com/embed/album/6RSsaKMLPtOJT7iEkjnrbD?utm_source=generator",
    spotifyUri: "spotify:album:6RSsaKMLPtOJT7iEkjnrbD",
  },
  {
    id: "dossier-noir",
    title: "Dossier Noir",
    artist: "Elite Secret",
    coverUrl: dossierNoirCover,
    coverAlt: "Album cover — Dossier Noir, Elite Secret",
    spotifyUrl: "https://open.spotify.com/album/58b61MBtuV3HjcBAtQIoMp",
    embedUrl:
      "https://open.spotify.com/embed/album/58b61MBtuV3HjcBAtQIoMp?utm_source=generator",
    spotifyUri: "spotify:album:58b61MBtuV3HjcBAtQIoMp",
  },
];
