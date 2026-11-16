import type { Artist } from "../types";
import nassirKelianPortrait from "../../assets/Nassir-kelian.jpg";
import enzalevraiPortrait from "../../assets/enzalevrai.jpg";
import kemiPortrait from "../../assets/Kemi2vinci (2).jpg";
import noriaPortrait from "../../assets/Noria-simo (2).jpg";

/**
 * An external listening destination for one artist (Spotify, Apple Music,
 * YouTube Music, Deezer, SoundCloud…). Only verified, artist-specific URLs —
 * never generic or shared links.
 */
export interface PlatformLink {
  /** Displayed platform name, e.g. "Spotify". */
  label: string;
  url: string;
}

/**
 * The artists currently associated with Arkane Production.
 *
 * Profiles only carry what is verifiable in the project today: name and
 * portrait. `excerptUrl` and `platforms` stay empty until the team provides
 * real audio files and real links — the UI degrades gracefully without them.
 */
export interface ArtistProfile extends Artist {
  imageUrl: string;
  imageAlt: string;
  /** CSS object-position keeping the subject framed on every ratio. */
  imagePosition?: string;
  /** Local or remote audio excerpt. Absent = play control shows its empty state. */
  excerptUrl?: string;
  /** Spotify artist URI (spotify:artist:…) — powers the in-tile embed player. */
  spotifyUri?: string;
  /** Verified listening platforms for this artist only. */
  platforms: PlatformLink[];
}

export const artists: ArtistProfile[] = [
  {
    id: "nassir-kelian",
    slug: "nassir-kelian",
    name: "Nassir-Kelian",
    imageUrl: nassirKelianPortrait,
    imageAlt: "Nassir-Kelian at the piano in a dark studio",
    imagePosition: "55% 38%",
    spotifyUri: "spotify:artist:6eDlwdr1mDGyPA1SEva6by",
    platforms: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/artist/6eDlwdr1mDGyPA1SEva6by",
      },
    ],
  },
  {
    id: "enzalevrai",
    slug: "enzalevrai",
    name: "Enzalevrai",
    imageUrl: enzalevraiPortrait,
    imageAlt: "Enzalevrai performing with a microphone, in a red jacket",
    imagePosition: "45% 42%",
    spotifyUri: "spotify:artist:4rOLWfiFv0Y10e0q9HN78o",
    platforms: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/artist/4rOLWfiFv0Y10e0q9HN78o",
      },
    ],
  },
  {
    id: "kemi2vinci",
    slug: "kemi2vinci",
    name: "Kemi2vinci",
    imageUrl: kemiPortrait,
    imageAlt: "Kemi2vinci, black-and-white profile portrait",
    imagePosition: "50% 42%",
    spotifyUri: "spotify:artist:3dPlbHnwcIRXl3XJTcwXHx",
    platforms: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/artist/3dPlbHnwcIRXl3XJTcwXHx",
      },
    ],
  },
  {
    id: "noria-simo",
    slug: "noria-simo",
    name: "Noria Simo",
    imageUrl: noriaPortrait,
    imageAlt: "Noria Simo wearing a hat and glasses, close-up portrait",
    imagePosition: "50% 36%",
    spotifyUri: "spotify:artist:30I088eUaRcwvVCcmhXyOu",
    platforms: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/artist/30I088eUaRcwvVCcmhXyOu",
      },
    ],
  },
];
