import { ArrowRight } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import ArkaneUniverse from "../components/ArkaneUniverse";
import ReleasePlayer from "../components/ReleasePlayer";
import Reveal from "../components/Reveal";
import { homeContent } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./HomePage.css";

const { hero, universe, rules, interlude, releases, outro } = homeContent;

/** Giant wordmark — letters rise in on load, clipped by an overflow mask. */
function HeroTitle() {
  return (
    <h1
      id="hero-title"
      className="hero__title"
      aria-label={`${hero.title} ${hero.subline}`}
    >
      <span className="hero__title-mask" aria-hidden="true">
        {hero.title.split("").map((char, i) => (
          <span
            key={i}
            className="hero__title-char"
            style={{ animationDelay: `${0.1 + i * 0.055}s` }}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="hero__title-line" aria-hidden="true">
        {hero.subline}
      </span>
    </h1>
  );
}

export default function HomePage() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          /* Hero — the image lags the scroll, the content lifts away. */
          gsap.set(".hero__image", { scale: 1.22 });
          gsap.to(".hero__image", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(".hero__content", {
            yPercent: -14,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "70% top",
              scrub: true,
            },
          });

          /* Interlude — slow drift through the frame. */
          gsap.set(".interlude__image", { scale: 1.16 });
          gsap.fromTo(
            ".interlude__image",
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: ".interlude",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          /* Rules — each line condenses out of the dark as it crosses. */
          scope.current
            ?.querySelectorAll<HTMLElement>(".rules__row")
            .forEach((row) => {
              const text = row.querySelector(".rules__text");
              const index = row.querySelector(".rules__index");
              if (!text || !index) return;

              gsap.fromTo(
                text,
                { autoAlpha: 0.13, y: 26 },
                {
                  autoAlpha: 1,
                  y: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: row,
                    start: "top 92%",
                    end: "top 58%",
                    scrub: true,
                  },
                },
              );
              gsap.fromTo(
                index,
                { autoAlpha: 0 },
                {
                  autoAlpha: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: row,
                    start: "top 92%",
                    end: "top 74%",
                    scrub: true,
                  },
                },
              );
            });
        },
        scope,
      );

      /* Re-measure trigger positions once webfonts settle the layout. */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope}>
      {/* ---------------------------------------------------------- Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <img
          className="hero__image"
          src={hero.image.src}
          alt={hero.image.alt}
          role="presentation"
          fetchPriority="high"
          style={{ "--hero-object": hero.image.position } as CSSProperties}
        />
        <div className="hero__overlay" aria-hidden="true" />

        <div className="hero__content container">
          <p className="label label--accent hero__eyebrow">{hero.eyebrow}</p>

          <div className="hero__grid">
            <HeroTitle />

            <div className="hero__side">
              <p className="hero__statement">{hero.statement}</p>
              <div className="hero__actions">
                <a className="btn btn--solid" href={hero.primaryCta.path}>
                  {hero.primaryCta.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a className="btn" href={hero.secondaryCta.path}>
                  {hero.secondaryCta.label}
                </a>
              </div>
            </div>
          </div>

          <ul role="list" className="hero__meta">
            {hero.meta.map((item) => (
              <li key={item} className="label hero__meta-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- Universe */}
      <ArkaneUniverse label={universe.label} />

      {/* ------------------------------------------------------ Interlude */}
      <figure className="interlude">
        <img
          className="interlude__image"
          src={interlude.src}
          alt={interlude.alt}
          loading="lazy"
          style={{ "--interlude-object": interlude.position } as CSSProperties}
        />
        <figcaption className="label interlude__caption">
          {interlude.caption}
        </figcaption>
      </figure>

      {/* ------------------------------------------------------- Releases */}
      <section className="releases" aria-labelledby="releases-heading">
        <div className="releases__inner container">
          <Reveal>
            <p className="label releases__label">{releases.label}</p>
            <div className="releases__head">
              <h2 id="releases-heading" className="releases__heading">
                {releases.heading}
              </h2>
              <a className="releases__more label" href={releases.moreLink.path}>
                {releases.moreLink.label}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          <ul role="list" className="releases__grid">
            {releases.items.map((release, i) => (
              <li key={release.title} className="release">
                <Reveal delay={i * 120}>
                  <article className="release-card">
                    <a
                      className="release-card__link"
                      href={releases.moreLink.path}
                      aria-label={`${release.title}${release.artist ? ` — ${release.artist}` : ""}`}
                    >
                      <span className="release-card__media">
                        <img
                          className="release-card__cover"
                          src={release.coverUrl}
                          alt=""
                          loading="lazy"
                        />
                      </span>
                      <span className="release-card__meta">
                        <span className="release-card__title">
                          {release.title}
                        </span>
                        <span className="release-card__sub label">
                          {[release.artist, release.kind]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <ArrowRight
                        className="release-card__arrow"
                        size={18}
                        aria-hidden="true"
                      />
                    </a>
                    <ReleasePlayer
                      id={release.title}
                      title={release.title}
                      spotifyUri={release.spotifyUri}
                      listenUrl={release.listenUrl}
                    />
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- Rules */}
      <section className="rules" aria-labelledby="rules-heading">
        <div className="rules__inner container">
          <Reveal>
            <h2 id="rules-heading" className="label rules__label">
              {rules.label}
            </h2>
          </Reveal>

          <ol className="rules__list">
            {rules.items.map((rule, i) => (
              <li key={rule} className="rules__item">
                <div className="rules__row">
                  <span className="rules__index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="rules__text">{rule}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- Outro */}
      <section className="outro" aria-labelledby="outro-heading">
        <div className="outro__inner container">
          <Reveal>
            <p className="label label--accent">{outro.label}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 id="outro-heading" className="outro__heading">
              {outro.heading}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="outro__actions">
              <a className="btn btn--solid" href={outro.primaryCta.path}>
                {outro.primaryCta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="btn" href={outro.secondaryCta.path}>
                {outro.secondaryCta.label}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
