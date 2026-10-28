import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import ArkaneUniverse from "../components/ArkaneUniverse";
import Reveal from "../components/Reveal";
import { homeContent } from "../data/site";
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
  return (
    <>
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
              <li key={release.title}>
                <Reveal delay={i * 120}>
                  <a
                    className="release-card"
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
                <Reveal className="rules__row" delay={i * 90}>
                  <span className="rules__index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="rules__text">{rule}</p>
                </Reveal>
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
    </>
  );
}
