import type { LocalizedText } from "../types";
import nassirKelianPhoto from "../../assets/Nassir-Kelian (2).jpg";
import tilanaPhoto from "../../assets/Tilana.jpg";
import loicMvondoPhoto from "../../assets/member-03.jpg";
import estelleNguemoPhoto from "../../assets/member-04.jpg";

/**
 * Team — the people behind Arkane Production.
 * Centralized source: real members only. Add an entry here and the page
 * renders it — never fabricate names, roles, bios or links.
 */
export interface TeamLink {
  label: LocalizedText;
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  /** Function inside the label — e.g. "Direction artistique". */
  role: LocalizedText;
  bio?: LocalizedText;
  photoUrl?: string;
  photoAlt?: LocalizedText;
  links?: TeamLink[];
  /** Portrait-led composition — the principals of the label. */
  featured?: boolean;
  /** Internal flag — fictional mockup profile (stock portrait under an
   * invented name). NOT a confirmed Arkane collaborator; never present
   * as real in public communication. */
  demo?: boolean;
  /** Order weight — lower comes first (responsables ahead). */
  order?: number;
}

export const team: TeamMember[] = [
  {
    id: "nassir-kelian",
    name: "Nassir-Kelian",
    role: { fr: "PDG", en: "CEO" },
    photoUrl: nassirKelianPhoto,
    photoAlt: {
      fr: "Nassir-Kelian au piano, lumière faible",
      en: "Nassir-Kelian at the piano, low light",
    },
    featured: true,
    order: 1,
  },
  {
    id: "tilana",
    name: "Tilana",
    role: { fr: "Manager", en: "Manager" },
    photoUrl: tilanaPhoto,
    photoAlt: {
      fr: "Tilana assise, micro à revers, en interview",
      en: "Tilana seated, lapel mic, mid-interview",
    },
    featured: true,
    order: 2,
  },
  /* --------------------------------------------------------------
   * DEMO profiles — fictional names on licensed stock portraits.
   *   member-03.jpg — unsplash.com/photos/JSyZk9zzIng (Terrillo Walls)
   *   member-04.jpg — unsplash.com/photos/e6ouIRE5vuI (Dwayne joe)
   * Not confirmed Arkane collaborators — mockup fillers only.
   * ------------------------------------------------------------ */
  {
    id: "loic-mvondo",
    name: "Loïc Mvondo",
    role: { fr: "Directeur artistique", en: "Art director" },
    photoUrl: loicMvondoPhoto,
    photoAlt: {
      fr: "Portrait studio d'un homme en costume noir (visuel de démonstration)",
      en: "Studio portrait of a man in a black suit (demo visual)",
    },
    featured: true,
    demo: true,
    order: 3,
  },
  {
    id: "estelle-nguemo",
    name: "Estelle Nguemo",
    role: {
      fr: "Responsable communication & relations publiques",
      en: "Communications & public relations lead",
    },
    photoUrl: estelleNguemoPhoto,
    photoAlt: {
      fr: "Portrait studio d'une femme à lunettes et cheveux afro (visuel de démonstration)",
      en: "Studio portrait of a woman with glasses and afro hair (demo visual)",
    },
    featured: true,
    demo: true,
    order: 4,
  },
];

export function sortedTeam(): TeamMember[] {
  return [...team].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name),
  );
}
