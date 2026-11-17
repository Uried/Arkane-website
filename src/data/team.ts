import type { LocalizedText } from "../types";

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
  /** Order weight — lower comes first (responsables ahead). */
  order?: number;
}

export const team: TeamMember[] = [];

export function sortedTeam(): TeamMember[] {
  return [...team].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name),
  );
}
