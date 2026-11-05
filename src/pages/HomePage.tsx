import { ArrowRight } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import ArkaneHero from "../components/ArkaneHero";
import ArkaneUniverse from "../components/ArkaneUniverse";
import HomeNews from "../components/HomeNews";
import ReleasePlayer from "../components/ReleasePlayer";
import Reveal from "../components/Reveal";
import { homeContentByLang } from "../data/site";
import { sortedNews } from "../data/news";
import { useI18n } from "../lib/i18n-store";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./HomePage.css";

export default function HomePage() {
  const scope = useRef<HTMLDivElement>(null);
  const { lang, pick } = useI18n();
  const { universe, rules, interlude, releases, outro } =
    homeContentByLang[lang];

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

        },
        scope,
      );

      /* Re-measure trigger positions once webfonts settle the layout. */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope },
  );

  /* Two exclusive hero states: the editorial news hero when the journal has
   * entries, otherwise the canonical Arkane hero — never both. */
  const hasNews = sortedNews().length > 0;

  return (
    <div ref={scope}>
      {/* ---------------------------------------------------------- Hero */}
      {hasNews ? (
        <HomeNews />
      ) : (
        <ArkaneHero />
      )}

      {/* ------------------------------------------------------- Universe */}
      <ArkaneUniverse
        label={universe.label}
        items={rules.items.map(pick)}
      />

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
