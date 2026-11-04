import type { HomeContent, NavItem, SiteConfig } from "../types";
import { getRelease, type ReleaseEntry } from "./releases";

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
  { label: "Contact", path: "/contact" },
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

/* Homepage releases feature the latest entries of the canonical catalog
 * (src/data/releases.ts) — same source as the Discography page. */
const featuredReleases = ["abats-5", "dossier-noir"]
  .map(getRelease)
  .filter((r): r is ReleaseEntry => Boolean(r));

/**
 * Homepage content — phase 01.
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
    items: featuredReleases.map((release) => ({
      title: release.title,
      artist: release.artistName,
      kind: release.kind,
      coverUrl: release.coverUrl,
      alt: release.coverAlt,
      listenUrl: release.listenUrl,
      spotifyUri: release.spotifyUri,
    })),
    moreLink: { label: "All releases", path: "/releases" },
  },
  outro: {
    label: "Le noir c'est véridique",
    heading: "Step into the Arkane.",
    primaryCta: { label: "Discover the artists", path: "/artists" },
    secondaryCta: { label: "Browse the releases", path: "/releases" },
  },
};
