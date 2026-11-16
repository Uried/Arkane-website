import type { Release } from "../types";
import abats5Cover from "../../assets/Abats5-cover-album.jpg";
import ceciExperienceCover from "../../assets/Ceci-est-une-experience-cover.jpg";
import davinciCodeCover from "../../assets/Davinci-code-cover.jpeg";
import dossierNoirCover from "../../assets/Dossier-noir-cover.jpg";
import type { PlatformLink } from "./artists";

/**
 * Arkane Production's release catalog — the single source of truth for
 * albums, EPs and singles. `Release` (types/index.ts) is the domain contract
 * a future back-office will serve; ReleaseEntry adds the display and
 * listening fields the front needs today. Only verified data goes here.
 */
export interface ReleaseEntry extends Release {
  coverUrl: string;
  coverAlt: string;
  /** CSS object-position keeping the artwork framed on every ratio. */
  coverPosition?: string;
  /** Display name until artistIds link to real artist profiles. */
  artistName?: string;
  /** Spotify URI (spotify:album:…) for the integrated embed player. */
  spotifyUri?: string;
  /** Public Spotify page, when known. */
  spotifyUrl?: string;
  /** Official embed URL (open.spotify.com/embed/...). */
  embedUrl?: string;
  /** Primary external listening destination (smart link or platform page). */
  listenUrl?: string;
  /** Additional verified listening destinations. */
  platforms?: PlatformLink[];
}

export const releases: ReleaseEntry[] = [
  {
    id: "davinci-code",
    slug: "davinci-code",
    title: "Da Vinci Code",
    kind: "album",
    artistIds: [],
    artistName: "2VINCI THE ALIEN",
    releasedAt: "2026-11-13",
    coverUrl: davinciCodeCover,
    coverAlt: "Album cover — Da Vinci Code, 2VINCI THE ALIEN",
    spotifyUrl: "https://open.spotify.com/album/6IM2bKqqxb2pGakSUcxSI5",
    embedUrl:
      "https://open.spotify.com/embed/album/6IM2bKqqxb2pGakSUcxSI5?utm_source=generator",
    spotifyUri: "spotify:album:6IM2bKqqxb2pGakSUcxSI5",
    listenUrl: "https://open.spotify.com/album/6IM2bKqqxb2pGakSUcxSI5",
    platforms: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/album/6IM2bKqqxb2pGakSUcxSI5",
      },
    ],
  },
  {
    id: "ceci-est-une-experience",
    slug: "ceci-est-une-experience",
    title: "Ceci est une expérience",
    kind: "ep",
    artistIds: [],
    artistName: "Noria Simo",
    releasedAt: "2026-10-13",
    coverUrl: ceciExperienceCover,
    coverAlt: "EP cover — Ceci est une expérience, Noria Simo",
    spotifyUrl: "https://open.spotify.com/album/31h4uQAuel8bOPPE46BrSJ",
    embedUrl:
      "https://open.spotify.com/embed/album/31h4uQAuel8bOPPE46BrSJ?utm_source=generator",
    spotifyUri: "spotify:album:31h4uQAuel8bOPPE46BrSJ",
    listenUrl: "https://open.spotify.com/album/31h4uQAuel8bOPPE46BrSJ",
    platforms: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/album/31h4uQAuel8bOPPE46BrSJ",
      },
    ],
  },
  {
    id: "abats-5",
    slug: "abats-5",
    title: "Abats 5",
    kind: "album",
    artistIds: [],
    artistName: "Arkane Production",
    releasedAt: "2026-06-08",
    coverUrl: abats5Cover,
    coverAlt: "Album cover — Abats 5",
    spotifyUrl: "https://open.spotify.com/album/6RSsaKMLPtOJT7iEkjnrbD",
    embedUrl:
      "https://open.spotify.com/embed/album/6RSsaKMLPtOJT7iEkjnrbD?utm_source=generator",
    spotifyUri: "spotify:album:6RSsaKMLPtOJT7iEkjnrbD",
    listenUrl: "https://open.spotify.com/album/6RSsaKMLPtOJT7iEkjnrbD",
    platforms: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/album/6RSsaKMLPtOJT7iEkjnrbD",
      },
    ],
  },
  {
    id: "dossier-noir",
    slug: "dossier-noir",
    title: "Dossier Noir",
    kind: "album",
    artistIds: [],
    artistName: "Nassir-Kélian",
    releasedAt: "2026-09-25",
    coverUrl: dossierNoirCover,
    coverAlt: "Album cover — Dossier Noir, Elite Secret",
    spotifyUrl: "https://open.spotify.com/album/58b61MBtuV3HjcBAtQIoMp",
    embedUrl:
      "https://open.spotify.com/embed/album/58b61MBtuV3HjcBAtQIoMp?utm_source=generator",
    spotifyUri: "spotify:album:58b61MBtuV3HjcBAtQIoMp",
    listenUrl: "https://bfan.link/dossier-noir",
    platforms: [
      { label: "Toutes plateformes", url: "https://bfan.link/dossier-noir" },
      {
        label: "Spotify",
        url: "https://open.spotify.com/album/58b61MBtuV3HjcBAtQIoMp",
      },
    ],
  },
];

export function getRelease(id: string): ReleaseEntry | undefined {
  return releases.find((release) => release.id === id);
}

/** Newest first once `releasedAt` is known; list order until then. */
export function sortedReleases(list: ReleaseEntry[] = releases) {
  return [...list].sort((a, b) => {
    if (a.releasedAt && b.releasedAt) {
      return b.releasedAt.localeCompare(a.releasedAt);
    }
    return 0;
  });
}

export interface ReleaseGroup {
  /** Year parsed from `releasedAt`; null = no known date yet. */
  year: number | null;
  items: ReleaseEntry[];
}

/** Timeline grouping — dated years first (desc), undated releases last. */
export function groupReleasesByYear(list: ReleaseEntry[]): ReleaseGroup[] {
  const groups = new Map<number | null, ReleaseEntry[]>();
  for (const item of list) {
    const year = item.releasedAt
      ? new Date(item.releasedAt).getFullYear()
      : null;
    const bucket = groups.get(year) ?? [];
    bucket.push(item);
    groups.set(year, bucket);
  }
  return [...groups.entries()]
    .sort((a, b) => (b[0] ?? -Infinity) - (a[0] ?? -Infinity))
    .map(([year, items]) => ({ year, items }));
}
