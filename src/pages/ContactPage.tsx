import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import heroImg from "../../assets/Envelope-dust-contact.jpg";
import {
  MIN_FILL_MS,
  submitContact,
  validateContact,
  type ContactErrors,
  type SubmitStatus,
} from "../lib/contact";
import { siteConfig } from "../data/site";
import { socialLinks } from "../data/socialLinks";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./ContactPage.css";
import type { DictKey } from "../i18n/dict";
import { useI18n } from "../lib/i18n-store";

const emptyValues = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const { t } = useI18n();
  const scope = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(0);
  const [values, setValues] = useState(emptyValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

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
            .fromTo(
              ".contact-hero__media img",
              { scale: 1.06, autoAlpha: 0.85 },
              { scale: 1, autoAlpha: 1, duration: 1.6, ease: "power2.out" },
              0,
            )
            .from(
              ".contact-hero__eyebrow",
              { autoAlpha: 0, y: -10, duration: 0.5 },
              0.25,
            )
            .from(
              ".contact-hero__char",
              { yPercent: 110, stagger: 0.03 },
              0.35,
            )
            .from(
              ".contact-hero__intro",
              { autoAlpha: 0, y: 20, duration: 0.55 },
              "-=0.35",
            )
            .from(
              ".contact-hero__rule",
              { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
              "-=0.3",
            )
            .from(
              ".contact-hero__meta > .label, .contact-hero__scroll",
              { autoAlpha: 0, duration: 0.4 },
              "-=0.2",
            );

          const onEnter = (
            targets: string,
            trigger: string,
            vars: gsap.TweenVars = {},
          ) => {
            const el = document.querySelector(trigger);
            if (!el) return;
            gsap.fromTo(
              targets,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                ease: "power2.out",
                stagger: 0.06,
                scrollTrigger: { trigger, start: "top 85%", once: true },
                ...vars,
              },
            );
          };

          onEnter(".contact-field", ".contact-form");
          onEnter(".contact-form__heading, .contact-form__foot", ".contact-form");
          onEnter(
            ".contact-social__item",
            ".contact-social__list",
            { y: 16, stagger: 0.05 },
          );

          const outro = document.querySelector(".contact-outro");
          if (outro) {
            gsap.fromTo(
              ".contact-outro__char",
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.03,
                scrollTrigger: {
                  trigger: outro,
                  start: "top 82%",
                  once: true,
                },
              },
            );
          }

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
    setStatus(await submitContact({ ...values, kind: "general" }));
  };

  const fieldError = (field: keyof typeof emptyValues) =>
    touched[field] && errors[field] ? errors[field] : undefined;

  const heroTitle = t("contact.heroTitle");

  return (
    <div ref={scope}>
      {/* ---------------------------------------------------------- Hero */}
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero__media" aria-hidden="true">
          <img src={heroImg} alt="" fetchPriority="high" />
        </div>
        <div className="contact-hero__inner container">
          <p className="label label--accent contact-hero__eyebrow">
            {siteConfig.name} — {t("page.contact")}
          </p>
          <div className="contact-hero__body">
            <h1 id="contact-title" className="contact-hero__title">
              <span className="visually-hidden">{heroTitle}</span>
              <span className="contact-hero__title-mask" aria-hidden="true">
                {heroTitle.split("").map((char, i) => (
                  <span key={i} className="contact-hero__char">
                    {char === " " ? " " : char}
                  </span>
                ))}
              </span>
            </h1>
            <p className="contact-hero__intro">{t("contact.intro")}</p>
            <div className="contact-hero__meta">
              <span className="contact-hero__rule" aria-hidden="true" />
              <span className="label">{t("contact.open")}</span>
              <a className="contact-hero__scroll" href="#contact-form">
                <ArrowDown size={14} aria-hidden="true" />
                <span className="label">{t("contact.scroll")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- Main : side + form */}
      <section className="contact-main" aria-label={t("page.contact")}>
        <div className="contact-main__grid container">
          {/* ------------------------------------------------- Form */}
          <div className="contact-main__form">
            <h2 className="contact-form__heading">{t("contact.write")}</h2>

            <form
              id="contact-form"
              className="contact-form"
              onSubmit={onSubmit}
              noValidate
            >
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

              <div className="contact-form__row">
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
                  rows={5}
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
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Social */}
      <section className="contact-social" aria-label={t("social.follow")}>
        <div className="contact-social__inner container">
          <div className="contact-social__head">
            <span className="label label--accent">{t("social.follow")}</span>
            <span className="contact-social__rule" aria-hidden="true" />
            <span className="contact-social__count" aria-hidden="true">
              {String(socialLinks.length).padStart(2, "0")}
            </span>
          </div>
          <ul className="contact-social__list" role="list">
            {socialLinks.map((social) =>
              social.clickable && social.url ? (
                <li key={social.id} className="contact-social__item">
                  <a
                    className="contact-social__row"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="contact-social__name">{social.name}</span>
                    <svg
                      className="contact-social__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={social.icon} fill="currentColor" />
                    </svg>
                    <ArrowUpRight
                      className="contact-social__arrow"
                      size={18}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ) : (
                <li
                  key={social.id}
                  className="contact-social__item is-static"
                >
                  <span className="contact-social__row">
                    <span className="contact-social__name">{social.name}</span>
                    <svg
                      className="contact-social__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={social.icon} fill="currentColor" />
                    </svg>
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------ Outro */}
      <section className="contact-outro" aria-hidden="true">
        <div className="contact-outro__inner container">
          <p className="contact-outro__line">
            <span className="contact-outro__mask">
              {t("contact.outro")
                .split("")
                .map((char, i) => (
                  <span key={i} className="contact-outro__char">
                    {char === " " ? " " : char}
                  </span>
                ))}
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
