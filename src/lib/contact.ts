/**
 * Contact channel — request types, payload shape, client-side validation and
 * the submission adapter. The backend endpoint (`/api/contact`) does not
 * exist yet: `submitContact` reports "unavailable" honestly instead of
 * simulating a send.
 */

export type ContactKind =
  | "artiste"
  | "partenariat"
  | "production"
  | "general"
  | "autre";

export const contactKinds: { id: ContactKind; label: string }[] = [
  { id: "artiste", label: "Proposition artistique" },
  { id: "partenariat", label: "Partenariat" },
  { id: "production", label: "Production" },
  { id: "general", label: "Question générale" },
  { id: "autre", label: "Autre demande" },
];

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  kind: ContactKind;
  message: string;
}

export type SubmitStatus =
  | "idle"
  | "sending"
  | "sent"
  | "unavailable"
  | "error";

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export function validateContact(
  values: Omit<ContactPayload, "kind">,
): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = "Indique ton nom.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Adresse e-mail invalide.";
  if (!values.subject.trim()) errors.subject = "Indique le sujet.";
  if (values.message.trim().length < 10)
    errors.message = "Message trop court (10 caractères minimum).";
  return errors;
}

/** Minimum time on page before a submission is trusted (anti-bot). */
export const MIN_FILL_MS = 2000;

export async function submitContact(
  _payload: ContactPayload,
): Promise<"sent" | "unavailable" | "error"> {
  void _payload;
  /* No backend yet — never pretend a message was sent. When the back-office
   * exists, this becomes: fetch("/api/contact", { method: "POST", ... }). */
  return "unavailable";
}
