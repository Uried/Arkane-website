import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Reveal from "../components/Reveal";
import {
  contactKinds,
  MIN_FILL_MS,
  submitContact,
  validateContact,
  type ContactErrors,
  type ContactKind,
  type SubmitStatus,
} from "../lib/contact";
import { siteConfig } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./ContactPage.css";
import type { DictKey } from "../i18n/dict";
import { useI18n } from "../lib/i18n-store";

const emptyValues = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const { t } = useI18n();
  const scope = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(0);
  const [kind, setKind] = useState<ContactKind>("general");
  const [values, setValues] = useState(emptyValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

  const selectedKind = contactKinds.find((k) => k.id === kind);

  useEffect(() => {
    mountedAt.current = Date.now();
    document.title = `${t("page.contact")} — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${siteConfig.name} — contact : propositions artistiques, partenariats, production, questions.`,
      );
  }, [t]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const intro = gsap.timeline({
            defaults: { duration: 0.7, ease: "power3.out" },
          });
          intro
            .from(".contact-hero__char", { yPercent: 110, stagger: 0.05 })
            .from(
              ".contact-hero__rule",
              { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
              "-=0.35",
            )
            .from(
              ".contact-hero__meta > *",
              { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.08 },
              "-=0.25",
            );

          gsap.fromTo(
            ".contact-kind",
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.05,
              scrollTrigger: {
                trigger: ".contact-kinds__list",
                start: "top 88%",
                once: true,
              },
            },
          );

          document.fonts?.ready.then(() => ScrollTrigger.refresh());
        },
        scope,
      );
      return () => mm.revert();
    },
    { scope },
  );

  const update = (field: keyof typeof emptyValues) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const next = { ...values, [field]: e.target.value };
      setValues(next);
      if (touched[field]) {
        setErrors(validateContact(next));
      }
    };

  const blur = (field: keyof typeof emptyValues) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateContact(values));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    const errs = validateContact(values);
    setErrors(errs);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errs).length > 0) return;

    /* Silent bot tripwires — never reach the real submit path. */
    if (honeypot || Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus("unavailable");
      return;
    }

    setStatus("sending");
    setStatus(await submitContact({ ...values, kind }));
  };

  const fieldError = (field: keyof typeof emptyValues) =>
    touched[field] && errors[field] ? errors[field] : undefined;

  return (
    <div ref={scope}>
      {/* ---------------------------------------------------------- Hero */}
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero__inner container">
          <p className="label label--accent contact-hero__eyebrow">
            {siteConfig.name}
          </p>
          <h1 id="contact-title" className="contact-hero__title">
            <span className="contact-hero__title-mask" aria-hidden="true">
              {t("page.contact").split("").map((char, i) => (
                <span key={i} className="contact-hero__char">
                  {char}
                </span>
              ))}
            </span>
            <span className="visually-hidden">Contact</span>
          </h1>
          <div className="contact-hero__meta">
            <span className="contact-hero__rule" aria-hidden="true" />
            <span className="label">{t("contact.open")}</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- Request kind */}
      <section className="contact-kinds" aria-labelledby="kinds-heading">
        <div className="contact-kinds__inner container">
          <fieldset className="contact-kinds__fieldset">
            <legend id="kinds-heading" className="label contact-kinds__legend">
              {t("contact.legend")}
            </legend>
            <div className="contact-kinds__list">
              {contactKinds.map((k, i) => (
                <label
                  key={k.id}
                  className={`contact-kind${kind === k.id ? " is-selected" : ""}`}
                >
                  <input
                    className="visually-hidden"
                    type="radio"
                    name="contact-kind"
                    value={k.id}
                    checked={kind === k.id}
                    onChange={() => setKind(k.id)}
                  />
                  <span className="contact-kind__index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="contact-kind__label">{t(`contact.kind.${k.id}` as DictKey)}</span>
                  <span className="contact-kind__mark" aria-hidden="true" />
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {/* ---------------------------------------------------------- Form */}
      <section className="contact-form-section" aria-labelledby="form-heading">
        <div className="contact-form__inner container">
          <Reveal>
            <h2 id="form-heading" className="contact-form__heading">
              {t("contact.write")}
              {selectedKind && (
                <span className="label contact-form__kind">
                  — {t(`contact.kind.${kind}` as DictKey)}
                </span>
              )}
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              {/* Honeypot — invisible to humans, catnip to bots */}
              <input
                className="contact-hp"
                type="text"
                name="_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="contact-form__grid">
                <div className="contact-field">
                  <label className="label" htmlFor="contact-name">
                    {t("contact.name")}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={update("name")}
                    onBlur={blur("name")}
                    aria-invalid={Boolean(fieldError("name"))}
                    aria-describedby={
                      fieldError("name") ? "contact-name-error" : undefined
                    }
                  />
                  {fieldError("name") && (
                    <p
                      id="contact-name-error"
                      className="contact-field__error"
                      role="alert"
                    >
                      {t(errors.name as DictKey)}
                    </p>
                  )}
                </div>

                <div className="contact-field">
                  <label className="label" htmlFor="contact-email">
                    {t("contact.email")}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={update("email")}
                    onBlur={blur("email")}
                    aria-invalid={Boolean(fieldError("email"))}
                    aria-describedby={
                      fieldError("email") ? "contact-email-error" : undefined
                    }
                  />
                  {fieldError("email") && (
                    <p
                      id="contact-email-error"
                      className="contact-field__error"
                      role="alert"
                    >
                      {t(errors.email as DictKey)}
                    </p>
                  )}
                </div>
              </div>

              <div className="contact-field">
                <label className="label" htmlFor="contact-subject">
                  {t("contact.subject")}
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  value={values.subject}
                  onChange={update("subject")}
                  onBlur={blur("subject")}
                  aria-invalid={Boolean(fieldError("subject"))}
                  aria-describedby={
                    fieldError("subject") ? "contact-subject-error" : undefined
                  }
                />
                {fieldError("subject") && (
                  <p
                    id="contact-subject-error"
                    className="contact-field__error"
                    role="alert"
                  >
                    {t(errors.subject as DictKey)}
                  </p>
                )}
              </div>

              <div className="contact-field">
                <label className="label" htmlFor="contact-message">
                  {t("contact.message")}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  value={values.message}
                  onChange={update("message")}
                  onBlur={blur("message")}
                  aria-invalid={Boolean(fieldError("message"))}
                  aria-describedby={
                    fieldError("message") ? "contact-message-error" : undefined
                  }
                />
                {fieldError("message") && (
                  <p
                    id="contact-message-error"
                    className="contact-field__error"
                    role="alert"
                  >
                    {t(errors.message as DictKey)}
                  </p>
                )}
              </div>

              <div className="contact-form__foot">
                <button
                  type="submit"
                  className="btn btn--solid contact-form__submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? (
                    <Loader2
                      className="contact-form__spinner"
                      size={16}
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowRight size={16} aria-hidden="true" />
                  )}
                  {t("action.send")}
                </button>
                {status === "unavailable" && (
                  <p className="contact-form__status" role="status">
                    {t("contact.status.unavailable")}
                  </p>
                )}
                {status === "sent" && (
                  <p className="contact-form__status" role="status">
                    {t("contact.status.sent")}
                  </p>
                )}
                {status === "error" && (
                  <p
                    className="contact-form__status contact-form__status--error"
                    role="alert"
                  >
                    {t("contact.status.error")}
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- Coordinates */}
      <section className="contact-direct" aria-label={t("contact.direct")}>
        <div className="contact-direct__inner container">
          <Reveal>
            <p className="label contact-direct__label">{t("contact.direct")}</p>
            <p className="contact-direct__note">{t("contact.soon")}</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
