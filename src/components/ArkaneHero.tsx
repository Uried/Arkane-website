import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { homeContentByLang } from "../data/site";
import { useI18n } from "../lib/i18n-store";
import type { HomeContent } from "../types";

/** Giant wordmark — letters rise in on load, clipped by an overflow mask. */
function HeroTitle({ hero }: { hero: HomeContent["hero"] }) {
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

/**
 * The canonical Arkane hero — used as the homepage hero when the journal is
 * empty AND as the interstitial slide between news cycles.
 */
export default function ArkaneHero() {
  const { lang } = useI18n();
  const { hero } = homeContentByLang[lang];
  return (
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
          <HeroTitle hero={hero} />

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
  );
}
