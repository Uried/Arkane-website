import type { HomeContent, NavItem, SiteConfig } from "../types";
import abats5Cover from "../../assets/Abats5-cover-album.jpg";
import dossierNoirCover from "../../assets/Dossier-noir-cover.jpg";
import { spotifyAlbums } from "./albums";

/**
 * Single source of truth for brand-level content.
 * Page sections, artists, releases and products will each get their own
 * data module as the site grows.
 */
export const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Artists", path: "/artists" },
  { label: "Releases", path: "/releases" },
  { label: "Editorial", path: "/editorial" },
  { label: "Shop", path: "/shop" },
];

export const siteConfig: SiteConfig = {
  name: "Arkane Production",
  shortName: "Arkane",
  tagline: "Music production house",
  statement:
    "Arkane Production crafts sound, records and visual worlds for its artists. The full experience is on its way.",
  description:
    "Arkane Production — an independent music production house. Artists, releases, editorial and more.",
  nav: navItems,
};

/**
 * Homepage content — phase 01.
 * Release titles/artists are derived from the artwork files themselves
 * (assets/) pending confirmed metadata; replace when the catalog is final.
 */
export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Independent music production house",
    title: "Arkane",
    subline: "Production",
    statement:
      "Arkane Production crafts sound, records and visual worlds for its artists.",
    primaryCta: { label: "Listen to the releases", path: "/releases" },
    secondaryCta: { label: "Explore the artists", path: "/artists" },
    meta: ["Sound", "Records", "Visual worlds"],
    image: {
      src: "/Fragments of Sound in Shadow.png",
      alt: "",
      position: "68% 50%",
    },
  },
  universe: {
    label: "L'univers Arkane",
  },
  rules: {
    label: "Les cinq règles de l'Arkane",
    items: [
      "on ne se soumet pas a la lois des plus faible",
      "on ne negocie pas",
      "toute proposition engendree par la peur est ignoree",
      "Nous n'attendons rien ni personee",
      "l'arkane vaincra",
    ],
  },
  interlude: {
    src: "/Vinyl_record_playing_on_turntable_404ce182.jpg",
    alt: "",
    position: "50% 60%",
    caption: "The studio",
  },
  releases: {
    label: "Releases",
    heading: "Pressed by the house.",
    items: [
      {
        title: "Abats 5",
        kind: "album",
        coverUrl: abats5Cover,
        alt: "Album cover — Abats 5",
        listenUrl: spotifyAlbums.find((a) => a.id === "abats-5")?.spotifyUrl,
        spotifyUri: spotifyAlbums.find((a) => a.id === "abats-5")?.spotifyUri,
      },
      {
        title: "Dossier Noir",
        artist: "Elite Secret",
        kind: "album",
        coverUrl: dossierNoirCover,
        alt: "Album cover — Dossier Noir, Elite Secret",
        listenUrl: "https://bfan.link/dossier-noir",
        spotifyUri: spotifyAlbums.find((a) => a.id === "dossier-noir")
          ?.spotifyUri,
      },
    ],
    moreLink: { label: "All releases", path: "/releases" },
  },
  outro: {
    label: "Le noir c'est véridique",
    heading: "Step into the Arkane.",
    primaryCta: { label: "Discover the artists", path: "/artists" },
    secondaryCta: { label: "Browse the releases", path: "/releases" },
  },
};
