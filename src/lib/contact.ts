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
  if (!values.name.trim()) errors.name = "contact.err.name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "contact.err.email";
  if (!values.subject.trim()) errors.subject = "contact.err.subject";
  if (values.message.trim().length < 10)
    errors.message = "contact.err.message";
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
