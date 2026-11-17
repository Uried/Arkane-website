import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import Reveal from "../components/Reveal";
import { sortedTeam, type TeamMember } from "../data/team";
import { siteConfig } from "../data/site";
import { gsap, useGSAP } from "../lib/gsap";
import { useI18n } from "../lib/i18n-store";
import "./TeamPage.css";

/** One title line — chars rise behind their mask on the intro. */
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

/** Editorial row — portrait left or right, alternating via CSS. */
function TeamMemberRow({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const { t, pick } = useI18n();
  return (
    <article className="team-member">
      <span className="team-member__index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      {member.photoUrl && (
        <div className="team-member__media">
          <img
            src={member.photoUrl}
            alt={member.photoAlt ? pick(member.photoAlt) : member.name}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="team-member__body">
        <h3 className="team-member__name">{member.name}</h3>
        <p className="team-member__role label">{pick(member.role)}</p>
        {member.bio && <p className="team-member__bio">{pick(member.bio)}</p>}
        {member.links && member.links.length > 0 && (
          <ul
            className="team-member__links"
            aria-label={`${t("team.links")} — ${member.name}`}
          >
            {member.links.map((link) => (
              <li key={link.url}>
                <a
                  className="team-member__link label"
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
          .from(".team-hero__char", { yPercent: 110, stagger: 0.025 })
          .from(
            ".team-hero__rule",
            { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
            "-=0.4",
          )
          .from(
            ".team-hero__meta > *:not(.team-hero__rule)",
            { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.08 },
            "-=0.25",
          );

        /* Member rows — photo slides in, text rises. */
        const rows = scope.current?.querySelectorAll(".team-member");
        rows?.forEach((row) => {
          gsap.from(row, {
            autoAlpha: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
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
          <p className="label team-hero__eyebrow">{siteConfig.name}</p>
          <h1 className="team-hero__title" id="team-title">
            <TitleLine text={t("team.title1")} />
            <TitleLine text={t("team.title2")} />
            <span className="visually-hidden">
              {t("team.title1")} {t("team.title2")}
            </span>
          </h1>
          <div className="team-hero__meta">
            <span className="team-hero__rule" aria-hidden="true" />
            <span className="label team-hero__count">
              {members.length > 0
                ? `${String(members.length).padStart(2, "0")} ${t("team.members")}`
                : t("team.collective")}
            </span>
          </div>
          <p className="team-hero__intro">{t("team.intro")}</p>
        </div>
      </section>

      {/* ------------------------------------------------------- Members */}
      <section className="team-members" aria-label={t("page.team")}>
        <div className="team-members__inner container">
          {members.length === 0 ? (
            <p className="label team-members__empty">{t("team.empty")}</p>
          ) : (
            <ol className="team-members__list" role="list">
              {members.map((member, i) => (
                <li key={member.id}>
                  <TeamMemberRow member={member} index={i} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------- Outro */}
      <section className="team-outro" aria-label={t("team.outroLabel")}>
        <div className="team-outro__inner container">
          <Reveal>
            <p className="label team-outro__label">{t("team.outroLabel")}</p>
            <p className="team-outro__statement">{t("team.outro")}</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
