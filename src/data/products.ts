import type { LocalizedText, Product } from "../types";
import tshirtArkaneImg from "../../assets/Designing_oversized_t-shirt_product_ebe87f6d.jpg";
import hoodieNoirImg from "../../assets/Creating_black_streetwear_hoodie_9cc220b6.jpg";
import hoodieBlancImg from "../../assets/White_hoodie_product_design_9cf35af4.jpg";
import casquetteImg from "../../assets/Black_cap_product_mockup_d54b86bd.jpg";
import toteBagImg from "../../assets/Black_tote_bag_product_mockup_e97ec49b.jpg";
import sacBandouliereImg from "../../assets/Crossbody_bag_product_mockup_design_5aca1b92.jpg";
import stickersImg from "../../assets/Sticker_pack_product_mockup_28c847a0.jpg";
import bagueImg from "../../assets/Silver_signet_ring_product_photo_8aa29594.jpg";
import dogTagArcheImg from "../../assets/Photographing_dog_tag_necklace_2eed5207.jpg";
import dogTagMonoImg from "../../assets/Photographing_dog_tag_necklace_003644dc.jpg";
import collier925Img from "../../assets/Silver_necklace_product_photograph_9d545378.jpg";
import collierDossierNoirImg from "../../assets/Hand_holding_necklace_product_photo_cd0a89d9.jpg";
import coffretDossierNoirImg from "../../assets/Dossier_Noir_collector_box_set_c25a0f7a.jpg";
import vinyleDossierNoirImg from "../../assets/Vinyl_record_product_presentation_4f3b7a55.jpg";

/**
 * Arkane Production's shop catalog — the single source of truth for merch.
 * `Product` (types/index.ts) is the domain contract a future back-office
 * will serve; ShopProduct adds the front fields. Only products with a real
 * visual in `assets/` go here — nothing fabricated: prices, stock and
 * technical specs stay absent until the team confirms them.
 */
export type ProductCategory =
  | "vetement"
  | "accessoire"
  | "edition"
  | "numerique"
  | "artiste";

/** The two merchandising lines of the house. */
export type ProductCollection = "signature" | "limited";

export const categoryOrder: ProductCategory[] = [
  "vetement",
  "accessoire",
  "edition",
  "numerique",
  "artiste",
];

export const collectionOrder: ProductCollection[] = ["signature", "limited"];

export interface ProductVariant {
  id: string;
  /** "Taille M", "Pendentif Arche", "Vinyle", … */
  label: LocalizedText;
  /** Known stock count — absent means stock untracked. */
  stock?: number;
}

export interface ProductImage {
  url: string;
  alt: LocalizedText;
  position?: string;
}

export interface ShopProduct extends Product {
  /** FCFA — XAF is the ISO code for Central African francs. */
  currency: "XAF";
  collection: ProductCollection;
  category?: ProductCategory;
  images: ProductImage[];
  variants?: ProductVariant[];
  /** False = sold out; undefined = not announced yet. */
  inStock?: boolean;
  /** Real limited-edition flag — shown as a tag, never decoration. */
  limited?: boolean;
  /** Highlighted product (e.g. lead slot of its collection). */
  featured?: boolean;
}

export const products: ShopProduct[] = [
  /* ------------------------------------------------ Arkane Signature ---- */
  {
    id: "tshirt-arkane",
    slug: "t-shirt-arkane",
    name: { fr: "T-shirt Arkane", en: "Arkane T-shirt" },
    description: {
      fr: "T-shirt oversize noir siglé Arkane — logo poitrine face, grand monogramme au dos.",
      en: "Black oversized Arkane T-shirt — chest logo on the front, large monogram on the back.",
    },
    collection: "signature",
    currency: "XAF",
    category: "vetement",
    images: [
      {
        url: tshirtArkaneImg,
        alt: {
          fr: "T-shirt oversize noir Arkane, vues face et dos",
          en: "Black oversized Arkane T-shirt, front and back views",
        },
        position: "22% 50%",
      },
    ],
  },
  {
    id: "hoodie-noir-arkane",
    slug: "hoodie-noir-arkane",
    name: { fr: "Hoodie noir Arkane", en: "Black Arkane hoodie" },
    description: {
      fr: "Hoodie streetwear noir siglé Arkane — logo poitrine face, grand monogramme au dos.",
      en: "Black streetwear Arkane hoodie — chest logo on the front, large monogram on the back.",
    },
    collection: "signature",
    currency: "XAF",
    category: "vetement",
    images: [
      {
        url: hoodieNoirImg,
        alt: {
          fr: "Hoodie noir Arkane, vues face et dos",
          en: "Black Arkane hoodie, front and back views",
        },
        position: "22% 50%",
      },
    ],
  },
  {
    id: "hoodie-blanc-arkane",
    slug: "hoodie-blanc-arkane",
    name: { fr: "Hoodie blanc Arkane", en: "White Arkane hoodie" },
    description: {
      fr: "Hoodie blanc siglé Arkane — logo poitrine face, grand monogramme noir au dos.",
      en: "White Arkane hoodie — chest logo on the front, large black monogram on the back.",
    },
    collection: "signature",
    currency: "XAF",
    category: "vetement",
    images: [
      {
        url: hoodieBlancImg,
        alt: {
          fr: "Hoodie blanc Arkane, vues face et dos",
          en: "White Arkane hoodie, front and back views",
        },
        position: "22% 50%",
      },
    ],
  },
  {
    id: "casquette-arkane",
    slug: "casquette-arkane",
    name: { fr: "Casquette Arkane", en: "Arkane cap" },
    description: {
      fr: "Casquette noire siglée Arkane — monogramme blanc brodé face.",
      en: "Black Arkane cap — white embroidered monogram on the front.",
    },
    collection: "signature",
    currency: "XAF",
    category: "accessoire",
    images: [
      {
        url: casquetteImg,
        alt: {
          fr: "Casquette noire Arkane, trois angles",
          en: "Black Arkane cap, three angles",
        },
        position: "15% 50%",
      },
    ],
  },
  {
    id: "tote-bag-arkane",
    slug: "tote-bag-arkane",
    name: { fr: "Tote bag Arkane", en: "Arkane tote bag" },
    description: {
      fr: "Tote bag noir siglé Arkane — grand monogramme blanc.",
      en: "Black Arkane tote bag — large white monogram.",
    },
    collection: "signature",
    currency: "XAF",
    category: "accessoire",
    images: [
      {
        url: toteBagImg,
        alt: {
          fr: "Tote bag noir Arkane, vues face et trois-quarts",
          en: "Black Arkane tote bag, front and three-quarter views",
        },
        position: "22% 50%",
      },
    ],
  },
  {
    id: "sac-bandouliere-arkane",
    slug: "sac-bandouliere-arkane",
    name: { fr: "Sac bandoulière Arkane", en: "Arkane crossbody bag" },
    description: {
      fr: "Sac bandoulière noir siglé Arkane — monogramme blanc face.",
      en: "Black Arkane crossbody bag — white monogram on the front.",
    },
    collection: "signature",
    currency: "XAF",
    category: "accessoire",
    images: [
      {
        url: sacBandouliereImg,
        alt: {
          fr: "Sac bandoulière noir Arkane, trois angles",
          en: "Black Arkane crossbody bag, three angles",
        },
        position: "17% 50%",
      },
    ],
  },
  {
    id: "stickers-arkane",
    slug: "pack-stickers-arkane",
    name: { fr: "Pack de stickers Arkane", en: "Arkane sticker pack" },
    description: {
      fr: "Pack de stickers Arkane — monogrammes, logotypes et variations graphiques du label.",
      en: "Arkane sticker pack — monograms, logotypes and graphic variations of the label.",
    },
    collection: "signature",
    currency: "XAF",
    category: "accessoire",
    images: [
      {
        url: stickersImg,
        alt: {
          fr: "Pack de stickers Arkane sur fond noir",
          en: "Arkane sticker pack on a black background",
        },
        position: "45% 50%",
      },
    ],
  },

  /* ------------------------------------------------- Limited Editions --- */
  {
    id: "coffret-dossier-noir",
    slug: "coffret-collector-dossier-noir",
    name: {
      fr: "Coffret collector Dossier Noir",
      en: "Dossier Noir collector box set",
    },
    description: {
      fr: "Coffret collector Dossier Noir — Nassir-Kelian. Vinyle, dog tag, livret et carte de collection numérotée.",
      en: "Dossier Noir collector box set — Nassir-Kelian. Vinyl record, dog tag, booklet and a numbered collector card.",
    },
    collection: "limited",
    currency: "XAF",
    category: "edition",
    limited: true,
    featured: true,
    images: [
      {
        url: coffretDossierNoirImg,
        alt: {
          fr: "Coffret collector Dossier Noir ouvert — vinyle, livret, dog tag et carte numérotée",
          en: "Open Dossier Noir collector box — vinyl record, booklet, dog tag and numbered card",
        },
        position: "50% 50%",
      },
    ],
  },
  {
    id: "vinyle-dossier-noir",
    slug: "vinyle-dossier-noir",
    name: { fr: "Vinyle Dossier Noir", en: "Dossier Noir vinyl" },
    description: {
      fr: "Dossier Noir — Nassir-Kelian, pressage vinyle du label.",
      en: "Dossier Noir — Nassir-Kelian, the label's vinyl pressing.",
    },
    collection: "limited",
    currency: "XAF",
    category: "edition",
    limited: true,
    images: [
      {
        url: vinyleDossierNoirImg,
        alt: {
          fr: "Vinyle Dossier Noir — Nassir-Kelian, pochette et disque édition limitée",
          en: "Dossier Noir vinyl — Nassir-Kelian, limited edition sleeve and record",
        },
        position: "50% 50%",
      },
    ],
  },
  {
    id: "collier-dog-tag-arkane",
    slug: "collier-dog-tag-arkane",
    name: { fr: "Collier dog tag Arkane", en: "Arkane dog tag necklace" },
    description: {
      fr: "Collier dog tag Arkane — plaque noire bordée d'argent sur chaîne, décliné en deux pendentifs.",
      en: "Arkane dog tag necklace — silver-rimmed black tag on a chain, available in two pendant designs.",
    },
    collection: "limited",
    currency: "XAF",
    category: "accessoire",
    limited: true,
    variants: [
      {
        id: "arche",
        label: { fr: "Pendentif Arche", en: "Arch pendant" },
      },
      {
        id: "monogramme",
        label: { fr: "Pendentif Monogramme", en: "Monogram pendant" },
      },
    ],
    images: [
      {
        url: dogTagArcheImg,
        alt: {
          fr: "Collier dog tag Arkane — pendentif Arche, trois angles",
          en: "Arkane dog tag necklace — Arch pendant, three angles",
        },
        position: "17% 50%",
      },
      {
        url: dogTagMonoImg,
        alt: {
          fr: "Collier dog tag Arkane — pendentif Monogramme, trois angles",
          en: "Arkane dog tag necklace — Monogram pendant, three angles",
        },
        position: "17% 50%",
      },
    ],
  },
  {
    id: "collier-925-arkane",
    slug: "collier-arkane-925",
    name: { fr: "Collier Arkane .925", en: "Arkane .925 necklace" },
    description: {
      fr: "Collier Arkane en argent — pendentif Arche ajouré, poinçon .925 Limited Edition gravé au dos.",
      en: "Silver Arkane necklace — openwork Arch pendant, .925 Limited Edition hallmark engraved on the back.",
    },
    collection: "limited",
    currency: "XAF",
    category: "accessoire",
    limited: true,
    images: [
      {
        url: collier925Img,
        alt: {
          fr: "Collier argent Arkane — pendentif Arche ajouré et poinçon .925",
          en: "Silver Arkane necklace — openwork Arch pendant and .925 hallmark",
        },
        position: "50% 50%",
      },
    ],
  },
  {
    id: "collier-dossier-noir",
    slug: "collier-dossier-noir",
    name: { fr: "Collier Dossier Noir", en: "Dossier Noir necklace" },
    description: {
      fr: "Collier Dossier Noir — pendentif carré au sceau « Dossier Noir — Secret File ».",
      en: "Dossier Noir necklace — square pendant bearing the “Dossier Noir — Secret File” seal.",
    },
    collection: "limited",
    currency: "XAF",
    category: "accessoire",
    limited: true,
    images: [
      {
        url: collierDossierNoirImg,
        alt: {
          fr: "Collier Dossier Noir tenu en main — pendentif carré au sceau Secret File",
          en: "Dossier Noir necklace held in hand — square pendant with the Secret File seal",
        },
        position: "50% 40%",
      },
    ],
  },
  {
    id: "bague-arkane",
    slug: "bague-arkane-signature",
    name: { fr: "Bague Arkane Signature", en: "Arkane Signature ring" },
    description: {
      fr: "Chevalière Arkane en argent — monogramme Arche gravé sur le plateau.",
      en: "Silver Arkane signet ring — Arch monogram engraved on the face.",
    },
    collection: "limited",
    currency: "XAF",
    category: "accessoire",
    limited: true,
    images: [
      {
        url: bagueImg,
        alt: {
          fr: "Chevalière argent Arkane, trois angles",
          en: "Silver Arkane signet ring, three angles",
        },
        position: "50% 50%",
      },
    ],
  },
];

export function getProduct(slug: string): ShopProduct | undefined {
  return products.find((p) => p.slug === slug);
}

/** "12 000 FCFA" — locale fr-FR, no decimals (XAF has no subunit in practice). */
export function formatPrice(cents: number): string {
  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(cents / 100)} FCFA`;
}
