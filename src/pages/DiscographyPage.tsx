import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Search } from "lucide-react";
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

const kindLabels: Record<ReleaseKind, string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
};

const kindOrder: ReleaseKind[] = ["album", "ep", "single"];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

type KindFilter = ReleaseKind | "all";

export default function DiscographyPage() {
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
    document.title = `Discographie — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${siteConfig.name} — discographie : ${releases.map((r) => r.title).join(", ")}.`,
      );
  }, []);

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

          /* Catalogue — one staggered entrance when the list scrolls in. */
          gsap.fromTo(
            ".disc-item",
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
              scrollTrigger: {
                trigger: ".disc-catalog",
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
              {"Discographie".split("").map((char, i) => (
                <span key={i} className="disc-hero__char">
                  {char}
                </span>
              ))}
            </span>
            <span className="visually-hidden">Discographie</span>
          </h1>

          <div className="disc-hero__meta">
            <span className="disc-hero__rule" aria-hidden="true" />
            <span className="label">Catalogue</span>
            <span className="label disc-hero__count">
              {String(releases.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- List */}
      <section className="disc" aria-label="Catalogue des sorties">
        <div className="disc__inner container">
          <div className="disc__toolbar">
            <div className="disc-filter" role="group" aria-label="Filtrer par type de sortie">
              <button
                type="button"
                className="disc-filter__btn"
                aria-pressed={kind === "all"}
                onClick={() => setKind("all")}
              >
                Tout
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
                    {kindLabels[k]}
                  </button>
                ))}
            </div>

            <label className="disc-search">
              <Search size={14} aria-hidden="true" />
              <span className="visually-hidden">Rechercher une sortie</span>
              <input
                className="disc-search__input"
                type="search"
                placeholder="Rechercher"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>

          {numbered.length === 0 ? (
            <p className="label disc__empty">
              Aucune sortie ne correspond à cette recherche.
            </p>
          ) : (
            <div className="disc-catalog">
              {numbered.map((group) => (
                <section
                  key={group.year ?? "undated"}
                  className="disc-year"
                  aria-label={
                    group.year ? `Sorties ${group.year}` : "Sorties"
                  }
                >
                  {group.year && (
                    <p className="disc-year__marker" aria-hidden="true">
                      {group.year}
                    </p>
                  )}
                  <ol className="disc-list" role="list">
                    {group.items.map(({ release, index }) => (
                      <DiscItem
                        key={release.id}
                        release={release}
                        index={index}
                        open={openId === release.id}
                        onToggle={() =>
                          setOpenId((id) =>
                            id === release.id ? null : release.id,
                          )
                        }
                      />
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * One catalogue row + expandable detail (cover, player, platforms).
 * ------------------------------------------------------------------------ */

interface DiscItemProps {
  release: ReleaseEntry;
  index: number;
  open: boolean;
  onToggle: () => void;
}

function DiscItem({ release, index, open, onToggle }: DiscItemProps) {
  return (
    <li className={`disc-item${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="disc-item__row"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="disc-item__index" aria-hidden="true">
          {String(index).padStart(2, "0")}
        </span>
        <img
          className="disc-item__thumb"
          src={release.coverUrl}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="disc-item__title">{release.title}</span>
        {release.artistName && (
          <span className="disc-item__artist">{release.artistName}</span>
        )}
        <span className="disc-item__kind">{kindLabels[release.kind]}</span>
        <ChevronDown
          className="disc-item__chevron"
          size={16}
          aria-hidden="true"
        />
      </button>

      <div className="disc-item__panel">
        <div className="disc-item__panel-inner">
          <img
            className="disc-item__cover"
            src={release.coverUrl}
            alt={release.coverAlt}
            loading="lazy"
            decoding="async"
          />
          <div className="disc-item__side">
            <ReleasePlayer
              id={release.id}
              title={release.title}
              spotifyUri={release.spotifyUri}
              listenUrl={release.listenUrl}
            />
            {release.platforms && release.platforms.length > 0 && (
              <ul className="disc-item__platforms" role="list">
                {release.platforms.map((platform) => (
                  <li key={platform.label}>
                    <a
                      className="disc-item__platform"
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
