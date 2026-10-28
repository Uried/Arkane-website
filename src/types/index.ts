/**
 * Shared types for the Arkane Production front-office.
 *
 * Domain models (Artist, Release, Article, Product) are defined now so that
 * static data in `src/data/` — and later API responses — share one contract.
 */

export interface NavItem {
  label: string;
  /** Internal path. Kept router-agnostic until routing is introduced. */
  path: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  statement: string;
  description: string;
  nav: NavItem[];
}

/* --- Homepage content ---------------------------------------------------- */

export interface CtaLink {
  label: string;
  path: string;
}

export interface HeroImage {
  /** URL served from `public/` — swap this single field to change the visual. */
  src: string;
  /** Decorative backgrounds keep an empty alt; describe only meaningful imagery. */
  alt: string;
  /** CSS object-position, e.g. "65% 50%" to keep the subject framed on mobile. */
  position?: string;
}

export interface HeroContent {
  eyebrow: string;
  /** Set in giant display type; short word(s) only. */
  title: string;
  /** Second line, rendered as outline type under the title. */
  subline: string;
  statement: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  /** Short mono labels along the hero baseline. */
  meta: string[];
  image: HeroImage;
}

export interface InterludeImage extends HeroImage {
  caption: string;
}

export interface ReleaseFeature {
  title: string;
  /** Artist or project name as shown on the artwork. */
  artist?: string;
  kind: ReleaseKind;
  coverUrl: string;
  alt: string;
  /** External listening destination for this release, when one is known. */
  listenUrl?: string;
  /** Spotify URI (spotify:album:…) for the integrated embed player. */
  spotifyUri?: string;
}

export interface ReleasesContent {
  label: string;
  heading: string;
  items: ReleaseFeature[];
  moreLink: CtaLink;
}

export interface OutroContent {
  label: string;
  heading: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

export interface UniverseContent {
  label: string;
}

export interface RulesContent {
  label: string;
  /** House rules — displayed verbatim, never corrected or reworded. */
  items: string[];
}

export interface HomeContent {
  hero: HeroContent;
  universe: UniverseContent;
  rules: RulesContent;
  interlude: InterludeImage;
  releases: ReleasesContent;
  outro: OutroContent;
}

/* --- Domain models (future phases) ------------------------------------- */

export type EntityId = string;

export interface Artist {
  id: EntityId;
  slug: string;
  name: string;
  bio?: string;
  imageUrl?: string;
}

export type ReleaseKind = "single" | "ep" | "album";

export interface Release {
  id: EntityId;
  slug: string;
  title: string;
  kind: ReleaseKind;
  artistIds: EntityId[];
  releasedAt?: string;
  coverUrl?: string;
}

export interface Article {
  id: EntityId;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  coverUrl?: string;
}

export interface Product {
  id: EntityId;
  slug: string;
  name: string;
  description?: string;
  /** Price in the smallest currency unit (e.g. cents) to avoid floats. */
  priceCents: number;
  currency: string;
  imageUrl?: string;
}
