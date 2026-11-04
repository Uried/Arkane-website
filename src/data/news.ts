import type { Article } from "../types";

/**
 * The editorial journal — announcements, artist news, label statements,
 * events and behind-the-scenes pieces.
 *
 * `Article` (types/index.ts) is the domain contract a future back-office
 * will serve; NewsEntry adds the front fields. Only verified publications
 * go here — nothing fabricated.
 */
export type NewsKind =
  | "sortie"
  | "artiste"
  | "label"
  | "evenement"
  | "coulisses";

export const newsKindLabels: Record<NewsKind, string> = {
  sortie: "Sortie",
  artiste: "Artiste",
  label: "Label",
  evenement: "Événement",
  coulisses: "Coulisses",
};

export const newsKindOrder: NewsKind[] = [
  "sortie",
  "artiste",
  "label",
  "evenement",
  "coulisses",
];

export interface NewsEntry extends Article {
  kind: NewsKind;
  coverAlt?: string;
  /** CSS object-position keeping the artwork framed on every ratio. */
  coverPosition?: string;
  /** Article body, one string per paragraph (CMS-ready). */
  body?: string[];
  /** Cross-links to real artists (src/data/artists.ts). */
  artistIds?: string[];
  /** Cross-links to real releases (src/data/releases.ts). */
  releaseIds?: string[];
}

export const news: NewsEntry[] = [];

export function getNews(slug: string): NewsEntry | undefined {
  return news.find((entry) => entry.slug === slug);
}

/** Newest first once `publishedAt` is known; list order until then. */
export function sortedNews(list: NewsEntry[] = news): NewsEntry[] {
  return [...list].sort((a, b) => {
    if (a.publishedAt && b.publishedAt) {
      return b.publishedAt.localeCompare(a.publishedAt);
    }
    return 0;
  });
}
