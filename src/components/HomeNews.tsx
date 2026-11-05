import { useEffect, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import ArkaneHero from "./ArkaneHero";
import { sortedNews } from "../data/news";
import { siteConfig } from "../data/site";
import "./HomeNews.css";
import type { DictKey } from "../i18n/dict";
import { useI18n } from "../lib/i18n-store";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Home hero rotation — one editorial story at a time (text left, poster stage
 * right). The cycle includes a final brand slide: after the last news entry
 * the canonical Arkane hero appears (the page as it looks without news),
 * then the rotation restarts from the first entry.
 * Returns null when the journal is empty: HomePage renders ArkaneHero itself.
 */
export default function HomeNews() {
  const { t } = useI18n();
  const items = sortedNews();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  const count = items.length;
  const total = count + 1; /* last position = brand hero slide */
  const safeIndex = Math.min(index, total - 1);
  const showingBrand = safeIndex === count;
  const entry = items[safeIndex];

  /* Auto-advance every 5s through news then the brand hero — off while
   * paused, hovered, single slide or reduced-motion; resets each slide. */
  useEffect(() => {
    if (total < 2 || !playing || hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % total), 5000);
    return () => clearTimeout(timer);
  }, [safeIndex, total, playing, hovered]);

  if (items.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const onKeyDown = (event: KeyboardEvent) => {
    if (total < 2) return;
    if (event.key === "ArrowLeft") prev();
    if (event.key === "ArrowRight") next();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setHovered(false);
      }}
      onKeyDown={onKeyDown}
    >
      {showingBrand ? (
        <ArkaneHero />
      ) : (
        <section
          className="news-banner"
          aria-roledescription="carrousel"
          aria-label={t("news.carousel")}
        >
          {/* Screen-reader status of the current slide. */}
          <p className="visually-hidden" role="status">
            {t("news.slideOf")} {safeIndex + 1} / {count} — {entry.title}
          </p>

          <div className="news-banner__slide" key={entry.id}>
            <div className="news-banner__inner container">
              <div className="news-banner__text">
                <p className="label label--accent news-banner__eyebrow">
                  {siteConfig.name}
                </p>
                <p className="news-banner__meta">
                  <span className="news-banner__kind">
                    {t(`kind.${entry.kind}` as DictKey)}
                  </span>
                  <span className="label news-banner__counter">
                    {pad(safeIndex + 1)} / {pad(count)}
                  </span>
                </p>
                <h2 className="news-banner__title">{entry.title}</h2>
                {entry.excerpt && (
                  <p className="news-banner__excerpt">{entry.excerpt}</p>
                )}
                <a
                  className="news-banner__cta"
                  href={entry.url ?? `/editorial/${entry.slug}`}
                  {...(entry.url
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {t("action.consult")}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>

              <div className="news-banner__stage">
                <span className="news-banner__ghost" aria-hidden="true">
                  {pad(safeIndex + 1)}
                </span>
                {entry.coverUrl && (
                  <img
                    className="news-banner__poster"
                    src={entry.coverUrl}
                    alt={entry.coverAlt ?? ""}
                    decoding="async"
                  />
                )}
              </div>
            </div>
          </div>

          {count > 1 && (
            <div className="news-banner__nav container">
              <button
                type="button"
                className="news-banner__arrow"
                aria-label={t("action.prev")}
                onClick={prev}
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <div
                className="news-banner__dots"
                role="group"
                aria-label={t("news.pick")}
              >
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    className="news-banner__dot"
                    aria-label={`${t("news.slideOf")} ${i + 1} — ${item.title}`}
                    aria-current={i === safeIndex}
                    onClick={() => setIndex(i)}
                  >
                    {pad(i + 1)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="news-banner__arrow"
                aria-label={
                  playing
                    ? t("news.pauseAuto")
                    : t("news.playAuto")
                }
                aria-pressed={!playing}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? (
                  <Pause size={14} aria-hidden="true" />
                ) : (
                  <Play size={14} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                className="news-banner__arrow"
                aria-label={t("action.next")}
                onClick={next}
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
