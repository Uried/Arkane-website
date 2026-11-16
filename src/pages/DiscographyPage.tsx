import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ExternalLink,
  Search,
} from "lucide-react";
import ReleasePlayer from "../components/ReleasePlayer";
import {
  groupReleasesByYear,
  releases,
  sortedReleases,
  type ReleaseEntry,
  type ReleaseGroup,
} from "../data/releases";
import { siteConfig } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import type { ReleaseKind } from "../types";
import "./DiscographyPage.css";
import type { DictKey } from "../i18n/dict";
import { useI18n } from "../lib/i18n-store";


const kindOrder: ReleaseKind[] = ["album", "ep", "single"];

/* Chronological frieze — cover widths cycle through the catalogue so the
 * composition stays asymmetric whatever the number of releases (see CSS). */
const SIZE_CYCLE = ["lg", "md", "sm"] as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/* Compact release date — "13-11-26" (JJ-MM-AA). Year-only values pass
 * through untouched; nothing is ever invented for missing fields. */
function formatReleaseDate(release: ReleaseEntry): string | null {
  if (!release.releasedAt) return null;
  const [y, m, d] = release.releasedAt.split("-").map(Number);
  if (!m || !d) return String(y);
  return [d, m, y % 100].map((n) => String(n).padStart(2, "0")).join("-");
}

type KindFilter = ReleaseKind | "all";

export default function DiscographyPage() {
  const { t } = useI18n();
  const scope = useRef<HTMLDivElement>(null);
  const yearHeadRef = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const availableKinds = new Set(releases.map((r) => r.kind));

  const filtered = sortedReleases(
    releases.filter((release) => {
      if (kind !== "all" && release.kind !== kind) return false;
      const needle = normalize(query.trim());
      if (!needle) return true;
      return [release.title, release.artistName ?? ""]
        .map(normalize)
        .some((value) => value.includes(needle));
    }),
  );

  /* One page per year — newest first; the frieze shows a single group and
   * navigation carries the visitor one year down at a time. */
  const groups = groupReleasesByYear(filtered);
  const keyOf = (group: ReleaseGroup) =>
    group.year === null ? "undated" : String(group.year);
  const activeIndex = Math.max(
    0,
    groups.findIndex((group) => keyOf(group) === selectedKey),
  );
  const activeGroup = groups[activeIndex];
  const newerGroup = activeIndex > 0 ? groups[activeIndex - 1] : undefined;
  const olderGroup =
    activeIndex < groups.length - 1 ? groups[activeIndex + 1] : undefined;

  const groupLabel = (group: ReleaseGroup) =>
    group.year === null ? t("releases.undated") : String(group.year);

  /* Jump to another year — close any open detail and bring the year
   * heading back into view (smooth scroll honours prefers-reduced-motion
   * through the global scroll-behavior rules). */
  const jumpTo = (group: ReleaseGroup) => {
    setSelectedKey(keyOf(group));
    setOpenId(null);
    requestAnimationFrame(() => {
      yearHeadRef.current?.scrollIntoView({ block: "start" });
    });
  };

  /* Page-level SEO — static meta in index.html stays the site default. */
  useEffect(() => {
    document.title = `${t("page.releases")} — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${siteConfig.name} — discographie : ${releases.map((r) => r.title).join(", ")}.`,
      );
  }, [t]);

  /* Hero intro — runs once, never replayed on year/filter changes. */
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
            .from(".disc-hero__char", { yPercent: 110, stagger: 0.04 })
            .from(
              ".disc-hero__rule",
              { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
              "-=0.35",
            )
            .from(
              ".disc-hero__meta > *",
              { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.08 },
              "-=0.25",
            );
        },
        scope,
      );
      return () => mm.revert();
    },
    { scope },
  );

  /* Frieze — spine draw + per-piece entrances. Re-armed whenever the
   * visible year (or the filtered list) changes the DOM. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          /* Nothing to animate when the filtered catalogue is empty. */
          if (!scope.current?.querySelector(".disc-timeline")) return;

          /* Year heading — settles in with the frieze it introduces. */
          gsap.fromTo(
            ".disc-yearhead",
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".disc-yearhead",
                start: "top 92%",
                once: true,
              },
            },
          );

          /* Spine — the central line draws itself while scrolling down. */
          gsap.fromTo(
            ".disc-timeline__line",
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".disc-timeline",
                start: "top 80%",
                end: "bottom 85%",
                scrub: 0.6,
              },
            },
          );

          /* Pieces — each slides in from its own side of the spine. */
          gsap.utils.toArray<HTMLElement>(".disc-piece").forEach((piece) => {
            const fromRight = piece.classList.contains("disc-piece--right");
            gsap.fromTo(
              piece,
              { autoAlpha: 0, x: fromRight ? 44 : -44, y: 20 },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: piece,
                  start: "top 86%",
                  once: true,
                },
              },
            );
          });

          /* Re-measure trigger positions once webfonts settle the layout. */
          document.fonts?.ready.then(() => ScrollTrigger.refresh());
        },
        scope,
      );
      return () => mm.revert();
    },
    { scope, dependencies: [selectedKey, kind, query], revertOnUpdate: true },
  );

  return (
    <div ref={scope}>
      {/* ---------------------------------------------------------- Hero */}
      <section className="disc-hero" aria-labelledby="discography-title">
        <div className="disc-hero__inner container">
          <p className="label label--accent disc-hero__eyebrow">
            {siteConfig.name}
          </p>

          <h1 id="discography-title" className="disc-hero__title">
            <span className="disc-hero__title-mask" aria-hidden="true">
              {t("page.releases").split("").map((char, i) => (
                <span key={i} className="disc-hero__char">
                  {char}
                </span>
              ))}
            </span>
            <span className="visually-hidden">Discographie</span>
          </h1>

          <div className="disc-hero__meta">
            <span className="disc-hero__rule" aria-hidden="true" />
            <span className="label">{t("releases.catalog")}</span>
            <span className="label disc-hero__count">
              {String(releases.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Timeline */}
      <section className="disc" aria-label={t("releases.catalog")}>
        <div className="disc__inner container">
          <div className="disc__toolbar">
            <div className="disc-filter" role="group" aria-label={t("releases.filter")}>
              <button
                type="button"
                className="disc-filter__btn"
                aria-pressed={kind === "all"}
                onClick={() => setKind("all")}
              >
                {t("action.all")}
              </button>
              {kindOrder
                .filter((k) => availableKinds.has(k))
                .map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="disc-filter__btn"
                    aria-pressed={kind === k}
                    onClick={() => setKind(k)}
                  >
                    {t(`kind.${k}` as DictKey)}
                  </button>
                ))}
            </div>

            <label className="disc-search">
              <Search size={14} aria-hidden="true" />
              <span className="visually-hidden">{t("releases.search")}</span>
              <input
                className="disc-search__input"
                type="search"
                placeholder={t("action.search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>

          {!activeGroup ? (
            <p className="label disc__empty">{t("releases.empty")}</p>
          ) : (
            <>
              {/* ----------------------------------------- Year heading */}
              <div className="disc-yearhead" ref={yearHeadRef}>
                {newerGroup && (
                  <button
                    type="button"
                    className="disc-yearhead__back"
                    aria-label={`${t("releases.yearNext")} : ${groupLabel(newerGroup)}`}
                    onClick={() => jumpTo(newerGroup)}
                  >
                    <ArrowUp size={12} aria-hidden="true" />
                    {t("releases.yearNext")} — {groupLabel(newerGroup)}
                  </button>
                )}
                <div className="disc-yearhead__row">
                  <h2 className="disc-yearhead__year">
                    {groupLabel(activeGroup)}
                  </h2>
                  <span className="label disc-yearhead__count">
                    {t("releases.yearLabel")} —{" "}
                    {String(activeGroup.items.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* ---------------------------------------------- Frieze */}
              <div className="disc-timeline">
                <span className="disc-timeline__line" aria-hidden="true" />
                <ol className="disc-timeline__list" role="list">
                  {activeGroup.items.map((release, i) => {
                    const index = i + 1;
                    const side = index % 2 === 1 ? "right" : "left";
                    return (
                      <DiscTimelineItem
                        key={release.id}
                        release={release}
                        index={index}
                        side={side}
                        size={SIZE_CYCLE[i % SIZE_CYCLE.length]}
                        open={openId === release.id}
                        onToggle={() =>
                          setOpenId((id) =>
                            id === release.id ? null : release.id,
                          )
                        }
                      />
                    );
                  })}
                </ol>
              </div>

              {/* ------------------------------ Previous-year gateway */}
              {olderGroup && (
                <div className="disc-yearnav">
                  <button
                    type="button"
                    className="disc-yearnav__btn"
                    aria-label={`${t("releases.yearPrev")} : ${groupLabel(olderGroup)}`}
                    onClick={() => jumpTo(olderGroup)}
                  >
                    <span className="label disc-yearnav__caption">
                      {t("releases.yearPrev")}
                    </span>
                    <span className="disc-yearnav__year">
                      {groupLabel(olderGroup)}
                    </span>
                    <ArrowDown
                      className="disc-yearnav__icon"
                      size={20}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * One entry on the frieze — year, artwork at its natural ratio, caption.
 * Clicking unfolds the full-width detail (player + platforms).
 * ------------------------------------------------------------------------ */

interface DiscTimelineItemProps {
  release: ReleaseEntry;
  index: number;
  /** Odd entries sit right of the spine, even entries left (per the sketch). */
  side: "left" | "right";
  size: (typeof SIZE_CYCLE)[number];
  open: boolean;
  onToggle: () => void;
}

function DiscTimelineItem({
  release,
  index,
  side,
  size,
  open,
  onToggle,
}: DiscTimelineItemProps) {
  const { t } = useI18n();
  const date = formatReleaseDate(release);
  return (
    <>
      <li
        className={`disc-piece disc-piece--${side} disc-piece--${size}${open ? " is-open" : ""}`}
      >
        <button
          type="button"
          className="disc-piece__hit"
          aria-expanded={open}
          onClick={onToggle}
        >
          {date !== null && (
            <span className="disc-piece__date">{date}</span>
          )}
          <span className="disc-piece__media">
            <img
              className="disc-piece__cover"
              src={release.coverUrl}
              alt={release.coverAlt}
              loading="lazy"
              decoding="async"
            />
            <span className="disc-piece__cue" aria-hidden="true">
              {t("releases.listen")}
              <ArrowUpRight size={13} />
            </span>
          </span>
          <span className="disc-piece__caption">
            <span className="disc-piece__index" aria-hidden="true">
              {String(index).padStart(2, "0")}
            </span>
            <span className="disc-piece__heading">
              <span className="disc-piece__title">{release.title}</span>
              {release.artistName && (
                <span className="disc-piece__artist">{release.artistName}</span>
              )}
            </span>
            <span className="disc-piece__kind">
              {t(`kind.${release.kind}` as DictKey)}
            </span>
          </span>
        </button>
      </li>
      {open && <DiscDetail release={release} />}
    </>
  );
}

/* --------------------------------------------------------------------------
 * Full-width detail — unfolds under the open piece (player + platforms).
 * ------------------------------------------------------------------------ */

function DiscDetail({ release }: { release: ReleaseEntry }) {
  const { t } = useI18n();
  return (
    <li className="disc-detail">
      <div className="disc-detail__clip">
        <div className="disc-detail__inner">
          <div className="disc-detail__meta">
            <p className="disc-detail__title">{release.title}</p>
            {release.artistName && (
              <p className="disc-detail__artist">{release.artistName}</p>
            )}
            <p className="label disc-detail__kind">
              {t(`kind.${release.kind}` as DictKey)}
            </p>
          </div>
          <div className="disc-detail__body">
            <ReleasePlayer
              id={release.id}
              title={release.title}
              spotifyUri={release.spotifyUri}
              listenUrl={release.listenUrl}
            />
            {release.platforms && release.platforms.length > 0 && (
              <ul className="disc-detail__platforms" role="list">
                {release.platforms.map((platform) => (
                  <li key={platform.label}>
                    <a
                      className="disc-detail__platform"
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {platform.label}
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
