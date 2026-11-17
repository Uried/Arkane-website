import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { sortedTeam, type TeamMember } from "../data/team";
import { siteConfig } from "../data/site";
import { gsap, useGSAP } from "../lib/gsap";
import { useI18n } from "../lib/i18n-store";
import "./TeamPage.css";

/** One masked title line — chars rise on the intro. */
function TitleLine({ text }: { text: string }) {
  return (
    <span className="team-hero__line">
      <span className="team-hero__line-mask" aria-hidden="true">
        {text.split("").map((ch, i) => (
          <span key={i} className="team-hero__char">
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Principal profile — large grayscale portrait, name and role beneath. */
function FeatureProfile({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const { t, pick } = useI18n();
  return (
    <article className="team-feature">
      <div className="team-feature__media">
        {member.photoUrl && (
          <img
            src={member.photoUrl}
            alt={member.photoAlt ? pick(member.photoAlt) : member.name}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        )}
        <span className="team-feature__index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="team-feature__body">
        <h3 className="team-feature__name">{member.name}</h3>
        <p className="team-feature__role label">{pick(member.role)}</p>
        {member.bio && <p className="team-feature__bio">{pick(member.bio)}</p>}
        {member.links && member.links.length > 0 && (
          <ul
            className="team-feature__links"
            aria-label={`${t("team.links")} — ${member.name}`}
          >
            {member.links.map((link) => (
              <li key={link.url}>
                <a
                  className="team-feature__link label"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pick(link.label)}
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/** Typographic row — functions without photography: role, name, bio only. */
function TeamRow({ member, index }: { member: TeamMember; index: number }) {
  const { t, pick } = useI18n();
  return (
    <article className="team-row">
      <span className="team-row__index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="team-row__role">{pick(member.role)}</p>
      <div className="team-row__body">
        {member.name && <h4 className="team-row__name">{member.name}</h4>}
        {member.bio && <p className="team-row__bio">{pick(member.bio)}</p>}
        {member.links && member.links.length > 0 && (
          <ul
            className="team-row__links"
            aria-label={`${t("team.links")} — ${member.name}`}
          >
            {member.links.map((link) => (
              <li key={link.url}>
                <a
                  className="team-row__link label"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pick(link.label)}
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function TeamPage() {
  const { t } = useI18n();
  const scope = useRef<HTMLDivElement>(null);
  const members = sortedTeam();
  const featured = members.filter((m) => m.featured);
  const rest = members.filter((m) => !m.featured);

  useEffect(() => {
    document.title = `${t("page.team")} — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t("team.intro"));
  }, [t]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({
          defaults: { duration: 0.7, ease: "power3.out" },
        });
        intro
          .from(".team-hero__char", { yPercent: 110, stagger: 0.03 })
          .from(
            ".team-hero__rule",
            { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
            "-=0.4",
          )
          .from(
            ".team-hero__intro > *",
            { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.1 },
            "-=0.25",
          );

        /* Portraits and typographic rows — quiet rises on scroll. */
        scope.current
          ?.querySelectorAll(".team-feature, .team-row")
          .forEach((el, i) => {
            gsap.from(el, {
              autoAlpha: 0,
              y: 36,
              duration: 0.8,
              delay: (i % 2) * 0.12,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });
      });
      return () => mm.revert();
    },
    { scope, dependencies: [members.length], revertOnUpdate: true },
  );

  return (
    <div ref={scope}>
      {/* ---------------------------------------------------------- Hero */}
      <section className="team-hero" aria-labelledby="team-title">
        <div className="team-hero__inner container">
          <p className="label label--accent team-hero__eyebrow">
            {t("page.team")}
          </p>
          <h1 className="team-hero__title" id="team-title">
            <TitleLine text="Arkane" />
            <TitleLine text="Production" />
            <span className="visually-hidden">{siteConfig.name}</span>
          </h1>
          <div className="team-hero__meta">
            <span className="team-hero__rule" aria-hidden="true" />
            <span className="label team-hero__count">{t("team.labelTag")}</span>
          </div>
          <div className="team-hero__intro">
            <p>{t("team.intro")}</p>
            <p>{t("team.intro2")}</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ Les visages d'Arkane */}
      <section className="team-people" aria-label={t("team.peopleLabel")}>
        <div className="team-people__inner container">
          <h2 className="team-people__label label">{t("team.peopleLabel")}</h2>

          {featured.length > 0 && (
            <div className="team-featured__grid">
              {featured.map((member, i) => (
                <FeatureProfile key={member.id} member={member} index={i} />
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <ol className="team-rows__list" role="list">
              {rest.map((member, i) => (
                <li key={member.id}>
                  <TeamRow member={member} index={i} />
                </li>
              ))}
            </ol>
          )}

          {members.length === 0 && (
            <p className="label team-members__empty">{t("team.empty")}</p>
          )}
        </div>
      </section>
    </div>
  );
}
