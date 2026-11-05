import type { Article } from "../types";
import nassirConcertPoster from "../../assets/nassir-kelian-en-concert-12-dec.jpeg";
import kemiReleasePartyPoster from "../../assets/kemi2vinci-release-party.jpg";
import kemiDaVinciCodePoster from "../../assets/kemi2vinci-da-vinci-code-coming-soon-album.jpg";

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
  | "projet"
  | "artiste"
  | "label"
  | "evenement"
  | "coulisses";

export const newsKindLabels: Record<NewsKind, string> = {
  sortie: "Sortie",
  projet: "Projet",
  artiste: "Artiste",
  label: "Label",
  evenement: "Événement",
  coulisses: "Coulisses",
};

export const newsKindOrder: NewsKind[] = [
  "sortie",
  "projet",
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
  /** Highlighted entry (e.g. homepage featured slot). */
  featured?: boolean;
  /** External destination, only when a real one is provided. */
  url?: string;
}

export const news: NewsEntry[] = [
  {
    id: "nassir-kelian-en-concert",
    slug: "nassir-kelian-en-concert",
    title: "Nassir Kelian en concert",
    kind: "evenement",
    excerpt:
      "Nassir Kelian annonce deux rendez-vous : le 28 novembre à Douala et le 12 décembre à Yaoundé. L'affiche indique une entrée gratuite et un début à 19h00.",
    coverUrl: nassirConcertPoster,
    coverAlt:
      "Affiche du concert de Nassir Kelian — 28 novembre à Douala, 12 décembre à Yaoundé, entrée gratuite, 19h00",
    artistIds: ["nassir-kelian"],
    featured: true,
  },
  {
    id: "kemi2vinci-release-party-da-vinci-code",
    slug: "kemi2vinci-release-party-da-vinci-code",
    title: "Kemi2vinci — Release Party Da Vinci Code",
    kind: "evenement",
    excerpt:
      "Kemi2vinci annonce la Release Party de Da Vinci Code au Bona Burger, le 13 novembre 2026 à 19h00. L'affiche indique un pass standard à 10 000 FCFA et une table VIP à 100 000 FCFA pour quatre personnes maximum.",
    coverUrl: kemiReleasePartyPoster,
    coverAlt:
      "Affiche de la Release Party Da Vinci Code de Kemi2vinci — Bona Burger, 13 novembre 2026 à 19h00",
    artistIds: ["kemi2vinci"],
  },
  {
    id: "kemi2vinci-da-vinci-code",
    slug: "kemi2vinci-da-vinci-code",
    title: "Da Vinci Code — Kemi2vinci",
    kind: "projet",
    excerpt: "Visuel promotionnel du projet Da Vinci Code de Kemi2vinci.",
    coverUrl: kemiDaVinciCodePoster,
    coverAlt:
      "Affiche promotionnelle du projet Da Vinci Code de Kemi2vinci",
    artistIds: ["kemi2vinci"],
  },
];

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
