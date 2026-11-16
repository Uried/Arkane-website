import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Search } from "lucide-react";
import ReleasePlayer from "../components/ReleasePlayer";
import {
  groupReleasesByYear,
  releases,
  sortedReleases,
  type ReleaseEntry,
} from "../data/releases";
import { siteConfig } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import type { ReleaseKind } from "../types";
import "./DiscographyPage.css";
import type { DictKey } from "../i18n/dict";
import { useI18n } from "../lib/i18n-store";


const kindOrder: ReleaseKind[] = ["album", "ep", "single"];

/* Editorial composition — six slots repeating through the catalogue. Each
 * slot carries its own column span and vertical offset (see CSS), so the
 * grid stays asymmetric whatever the number of releases. */
const SLOT_CYCLE = ["a", "b", "c", "d", "e", "f"] as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

type KindFilter = ReleaseKind | "all";

export default function DiscographyPage() {
  const { t } = useI18n();
  const scope = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

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

  const groups = groupReleasesByYear(filtered);

  /* Continuous catalogue numbering across groups. */
  let itemIndex = 0;
  const numbered = groups.map((group) => ({
    ...group,
    items: group.items.map((release) => ({ release, index: ++itemIndex })),
  }));

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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          /* Hero — title chars rise behind their mask, rule draws, meta fades. */
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

          /* Catalogue — one staggered entrance when the grid scrolls in. */
          gsap.fromTo(
            ".disc-piece",
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: ".disc-grid",
                start: "top 88%",
                once: true,
              },
            },
          );

          /* Re-measure trigger positions once webfonts settle the layout. */
          document.fonts?.ready.then(() => ScrollTrigger.refresh());
        },
        scope,
      );

      return () => mm.revert();
    },
    { scope },
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

      {/* ----------------------------------------------------------- Grid */}
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

          {numbered.length === 0 ? (
            <p className="label disc__empty">{t("releases.empty")}</p>
          ) : (
            <ol className="disc-grid" role="list">
              {numbered.map((group) => (
                <Fragment key={group.year ?? "undated"}>
                  {group.year && (
                    <li className="disc-grid__year" aria-hidden="true">
                      {group.year}
                    </li>
                  )}
                  {group.items.map(({ release, index }) => (
                    <Fragment key={release.id}>
                      <DiscPiece
                        release={release}
                        index={index}
                        slot={
                          SLOT_CYCLE[(index - 1) % SLOT_CYCLE.length]
                        }
                        open={openId === release.id}
                        onToggle={() =>
                          setOpenId((id) =>
                            id === release.id ? null : release.id,
                          )
                        }
                      />
                      {openId === release.id && (
                        <DiscDetail release={release} />
                      )}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * One exhibited piece — artwork at its natural ratio + discreet caption.
 * ------------------------------------------------------------------------ */

interface DiscPieceProps {
  release: ReleaseEntry;
  index: number;
  slot: (typeof SLOT_CYCLE)[number];
  open: boolean;
  onToggle: () => void;
}

function DiscPiece({ release, index, slot, open, onToggle }: DiscPieceProps) {
  const { t } = useI18n();
  return (
    <li className={`disc-piece disc-piece--${slot}${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="disc-piece__hit"
        aria-expanded={open}
        onClick={onToggle}
      >
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
