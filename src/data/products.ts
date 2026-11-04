import type { Product } from "../types";

/**
 * Arkane Production's shop catalog — the single source of truth for merch.
 * `Product` (types/index.ts) is the domain contract a future back-office
 * will serve; ShopProduct adds the front fields. Only verified products go
 * here — nothing fabricated.
 */
export type ProductCategory =
  | "vetement"
  | "accessoire"
  | "edition"
  | "numerique"
  | "artiste";

export const categoryLabels: Record<ProductCategory, string> = {
  vetement: "Vêtements",
  accessoire: "Accessoires",
  edition: "Éditions limitées",
  numerique: "Numérique",
  artiste: "Artistes",
};

export const categoryOrder: ProductCategory[] = [
  "vetement",
  "accessoire",
  "edition",
  "numerique",
  "artiste",
];

export interface ProductVariant {
  id: string;
  /** "Taille M", "Pointure 42", "Vinyle", … */
  label: string;
  /** Known stock count — absent means stock untracked. */
  stock?: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  position?: string;
}

export interface ShopProduct extends Product {
  /** FCFA — XAF is the ISO code for Central African francs. */
  currency: "XAF";
  category?: ProductCategory;
  images: ProductImage[];
  variants?: ProductVariant[];
  /** False = sold out; undefined = not announced yet. */
  inStock?: boolean;
  /** Real limited-edition flag — shown as a tag, never decoration. */
  limited?: boolean;
}

export const products: ShopProduct[] = [];

export function getProduct(slug: string): ShopProduct | undefined {
  return products.find((p) => p.slug === slug);
}

/** "12 000 FCFA" — locale fr-FR, no decimals (XAF has no subunit in practice). */
export function formatPrice(cents: number): string {
  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(cents / 100)} FCFA`;
}
