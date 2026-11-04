import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Search } from "lucide-react";
import {
  getNews,
  news,
  newsKindLabels,
  newsKindOrder,
  sortedNews,
  type NewsKind,
} from "../data/news";
import { siteConfig } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./EditorialPage.css";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type KindFilter = NewsKind | "all";

export default function EditorialPage() {
  const scope = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const availableKinds = new Set(news.map((entry) => entry.kind));

  const filtered = sortedNews(
    news.filter((entry) => {
      if (kind !== "all" && entry.kind !== kind) return false;
      const needle = normalize(query.trim());
      if (!needle) return true;
      return [entry.title, entry.excerpt ?? ""]
        .map(normalize)
        .some((value) => value.includes(needle));
    }),
  );

  const hovered = hoveredId ? getNews(hoveredId) : undefined;

  /* Page-level SEO — static meta in index.html stays the site default. */
  useEffect(() => {
    document.title = `Actualités — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${siteConfig.name} — actualités du label, des artistes et des sorties.`,
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
            .from(".news-hero__char", { yPercent: 110, stagger: 0.04 })
            .from(
              ".news-hero__rule",
              { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
              "-=0.35",
            )
            .from(
              ".news-hero__meta > *",
              { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.08 },
              "-=0.25",
            );

          /* Index — one staggered entrance when the list scrolls in. */
          gsap.fromTo(
            ".news-item",
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
              scrollTrigger: {
                trigger: ".news-list",
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

      /* Cover preview follows the cursor — fine pointers only. */
      mm.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
        () => {
          const preview = previewRef.current;
          if (!preview) return;
          const xTo = gsap.quickTo(preview, "x", {
            duration: 0.35,
            ease: "power3",
          });
          const yTo = gsap.quickTo(preview, "y", {
            duration: 0.35,
            ease: "power3",
          });
          const onMove = (event: MouseEvent) => {
            xTo(event.clientX + 24);
            yTo(event.clientY - 88);
          };
          window.addEventListener("mousemove", onMove);
          return () => window.removeEventListener("mousemove", onMove);
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope}>
      {/* ---------------------------------------------------------- Hero */}
      <section className="news-hero" aria-labelledby="news-title">
        <div className="news-hero__inner container">
          <p className="label label--accent news-hero__eyebrow">
            {siteConfig.name}
          </p>

          <h1 id="news-title" className="news-hero__title">
            <span className="news-hero__title-mask" aria-hidden="true">
              {"Actualités".split("").map((char, i) => (
                <span key={i} className="news-hero__char">
                  {char}
                </span>
              ))}
            </span>
            <span className="visually-hidden">Actualités</span>
          </h1>

          <div className="news-hero__meta">
            <span className="news-hero__rule" aria-hidden="true" />
            <span className="label">Journal</span>
            <span className="label news-hero__count">
              {String(news.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Index */}
      <section className="news" aria-label="Index des actualités">
        <div className="news__inner container">
          {news.length > 0 && (
            <div className="news__toolbar">
              <div
                className="news-filter"
                role="group"
                aria-label="Filtrer par type de publication"
              >
                <button
                  type="button"
                  className="news-filter__btn"
                  aria-pressed={kind === "all"}
                  onClick={() => setKind("all")}
                >
                  Tout
                </button>
                {newsKindOrder
                  .filter((k) => availableKinds.has(k))
                  .map((k) => (
                    <button
                      key={k}
                      type="button"
                      className="news-filter__btn"
                      aria-pressed={kind === k}
                      onClick={() => setKind(k)}
                    >
                      {newsKindLabels[k]}
                    </button>
                  ))}
              </div>

              <label className="news-search">
                <Search size={14} aria-hidden="true" />
                <span className="visually-hidden">
                  Rechercher une actualité
                </span>
                <input
                  className="news-search__input"
                  type="search"
                  placeholder="Rechercher"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="label news__empty">
              {news.length === 0
                ? "Aucune actualité publiée pour le moment."
                : "Aucune actualité ne correspond à cette recherche."}
            </p>
          ) : (
            <ol className="news-list" role="list">
              {filtered.map((entry, i) => (
                <li key={entry.id} className="news-item">
                  <a
                    className="news-item__row"
                    href={`/editorial/${entry.slug}`}
                    onMouseEnter={() => setHoveredId(entry.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(entry.id)}
                    onBlur={() => setHoveredId(null)}
                  >
                    <span className="news-item__index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="news-item__date">
                      {formatDate(entry.publishedAt) ?? "—"}
                    </span>
                    <span className="news-item__kind">
                      {newsKindLabels[entry.kind]}
                    </span>
                    <span className="news-item__title">{entry.title}</span>
                    {entry.coverUrl && (
                      <img
                        className="news-item__thumb"
                        src={entry.coverUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        style={
                          {
                            "--news-object": entry.coverPosition ?? "50% 40%",
                          } as CSSProperties
                        }
                      />
                    )}
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Floating cover preview — desktop pointers, decoration only */}
      <div
        ref={previewRef}
        className={`news-preview${hovered?.coverUrl ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {hovered?.coverUrl && <img src={hovered.coverUrl} alt="" />}
      </div>
    </div>
  );
}
