import type { HomeContent, Lang, NavItem, SiteConfig } from "../types";
import { getRelease, type ReleaseEntry } from "./releases";

/**
 * Single source of truth for brand-level content.
 * Nav labels and homepage copy are bilingual — pick `navItemsByLang[lang]`
 * and `homeContentByLang[lang]` via useI18n().
 */
export const navItemsByLang: Record<Lang, NavItem[]> = {
  fr: [
    { label: "Accueil", path: "/" },
    { label: "Artistes", path: "/artists" },
    { label: "Sorties", path: "/releases" },
    { label: "Journal", path: "/editorial" },
    { label: "Contact", path: "/contact" },
    { label: "Boutique", path: "/shop" },
  ],
  en: [
    { label: "Home", path: "/" },
    { label: "Artists", path: "/artists" },
    { label: "Releases", path: "/releases" },
    { label: "Editorial", path: "/editorial" },
    { label: "Contact", path: "/contact" },
    { label: "Shop", path: "/shop" },
  ],
};

export const siteConfig: SiteConfig = {
  name: "Arkane Production",
  shortName: "Arkane",
  tagline: "Music production house",
  statement:
    "Arkane Production crafts sound, records and visual worlds for its artists. The full experience is on its way.",
  description:
    "Arkane Production — an independent music production house. Artists, releases, editorial and more.",
  nav: navItemsByLang.fr,
};

/* Homepage releases feature the latest entries of the canonical catalog
 * (src/data/releases.ts) — same source as the Discography page. */
const featuredReleases = ["abats-5", "dossier-noir"]
  .map(getRelease)
  .filter((r): r is ReleaseEntry => Boolean(r));

const releaseFeatures = featuredReleases.map((release) => ({
  title: release.title,
  artist: release.artistName,
  kind: release.kind,
  coverUrl: release.coverUrl,
  alt: release.coverAlt,
  listenUrl: release.listenUrl,
  spotifyUri: release.spotifyUri,
}));

const heroImage = {
  src: "/Fragments of Sound in Shadow.png",
  alt: "",
  position: "68% 50%",
};

const interludeImage = {
  src: "/Vinyl_record_playing_on_turntable_404ce182.jpg",
  alt: "",
  position: "50% 60%",
};

export const homeContentByLang: Record<Lang, HomeContent> = {
  fr: {
    hero: {
      eyebrow: "Maison de production musicale indépendante",
      title: "Arkane",
      subline: "Production",
      statement:
        "Arkane Production façonne le son, les disques et les mondes visuels de ses artistes.",
      primaryCta: { label: "Écouter les sorties", path: "/releases" },
      secondaryCta: { label: "Découvrir les artistes", path: "/artists" },
      meta: ["Son", "Disques", "Mondes visuels"],
      image: heroImage,
    },
    universe: { label: "L'univers Arkane" },
    rules: {
      label: "Les cinq règles de l'Arkane",
      items: [
        { fr: "On ne se soumet pas à la loi des plus faibles", en: "We do not bow to the law of the weakest" },
        { fr: "On ne négocie pas", en: "We do not negotiate" },
        {
          fr: "Toute proposition engendrée par la peur est ignorée",
          en: "Any proposal born of fear is ignored",
        },
        { fr: "Nous n'attendons rien ni personne", en: "We expect nothing from anyone" },
        { fr: "L'Arkane vaincra", en: "The Arkane shall prevail" },
      ],
    },
    interlude: { ...interludeImage, caption: "Le studio" },
    releases: {
      label: "Sorties",
      heading: "Pressées par la maison.",
      items: releaseFeatures,
      moreLink: { label: "Toutes les sorties", path: "/releases" },
    },
    outro: {
      label: "Le noir c'est véridique",
      heading: "Entre dans l'Arkane.",
      primaryCta: { label: "Découvrir les artistes", path: "/artists" },
      secondaryCta: { label: "Parcourir les sorties", path: "/releases" },
    },
  },
  en: {
    hero: {
      eyebrow: "Independent music production house",
      title: "Arkane",
      subline: "Production",
      statement:
        "Arkane Production crafts sound, records and visual worlds for its artists.",
      primaryCta: { label: "Listen to the releases", path: "/releases" },
      secondaryCta: { label: "Explore the artists", path: "/artists" },
      meta: ["Sound", "Records", "Visual worlds"],
      image: heroImage,
    },
    universe: { label: "The Arkane universe" },
    rules: {
      label: "The five rules of the Arkane",
      items: [
        { fr: "On ne se soumet pas à la loi des plus faibles", en: "We do not bow to the law of the weakest" },
        { fr: "On ne négocie pas", en: "We do not negotiate" },
        {
          fr: "Toute proposition engendrée par la peur est ignorée",
          en: "Any proposal born of fear is ignored",
        },
        { fr: "Nous n'attendons rien ni personne", en: "We expect nothing from anyone" },
        { fr: "L'Arkane vaincra", en: "The Arkane shall prevail" },
      ],
    },
    interlude: { ...interludeImage, caption: "The studio" },
    releases: {
      label: "Releases",
      heading: "Pressed by the house.",
      items: releaseFeatures,
      moreLink: { label: "All releases", path: "/releases" },
    },
    outro: {
      label: "Le noir c'est véridique",
      heading: "Step into the Arkane.",
      primaryCta: { label: "Discover the artists", path: "/artists" },
      secondaryCta: { label: "Browse the releases", path: "/releases" },
    },
  },
};
