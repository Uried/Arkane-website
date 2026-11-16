import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { artists, type ArtistProfile } from "../data/artists";
import { news, type NewsEntry } from "../data/news";
import { siteConfig } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./EditorialPage.css";
import { useI18n } from "../lib/i18n-store";

const pad = (n: number) => String(n).padStart(2, "0");

/* --------------------------------------------------------------------------
 * Event dates — extracted from the excerpts already in the data ("le 28
 * novembre à Douala", "au Bona Burger, le 13 novembre 2026 à 19h00").
 * No field is added to news.ts and nothing is inferred beyond the text.
 * ------------------------------------------------------------------------ */

const MONTH_INDEX: Record<string, number> = {
  janvier: 0,
  "février": 1,
  fevrier: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  "août": 7,
  aout: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  "décembre": 11,
  decembre: 11,
};

const DATE_RE =
  /(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)(?:\s+(\d{4}))?/gi;

/* Venue = capitalized words following "à/au/aux" — "Bona Burger", "Douala". */
const VENUE_RE =
  /(?:au|à|aux)\s+([A-ZÀ-Ý][A-Za-zÀ-ÿ'’-]*(?:\s+[A-ZÀ-Ý][A-Za-zÀ-ÿ'’-]*)*)/;

export interface EventDate {
  date: Date;
  /** Place read next to the date in the excerpt, when the text gives one. */
  venue?: string;
}

interface EventView {
  entry: NewsEntry;
  dates: EventDate[];
  /** First upcoming date — drives the featured pick. */
  nextDate?: Date;
  /** true only when every known date lies in the past. */
  past: boolean;
  artists: ArtistProfile[];
}

function venueNear(text: string, matchIndex: number, matchLength: number) {
  const after = text.slice(
    matchIndex + matchLength,
    matchIndex + matchLength + 80,
  );
  const forward = VENUE_RE.exec(after);
  if (forward) return forward[1];
  /* Venue stated before the date — "au Bona Burger, le 13 novembre". */
  const before = text.slice(Math.max(0, matchIndex - 80), matchIndex);
  let last: RegExpExecArray | null = null;
  for (const m of before.matchAll(new RegExp(VENUE_RE, "g"))) last = m;
  return last?.[1];
}

function eventDatesOf(entry: NewsEntry): EventDate[] {
  const text = entry.excerpt?.fr;
  if (!text) return [];
  const found: EventDate[] = [];
  const now = new Date();
  const thisYear = now.getFullYear();
  const today = new Date(thisYear, now.getMonth(), now.getDate());
  for (const m of text.matchAll(DATE_RE)) {
    const day = Number(m[1]);
    const month = MONTH_INDEX[m[2].toLowerCase()];
    let date = new Date(thisYear, month, day);
    if (m[3]) {
      date = new Date(Number(m[3]), month, day);
    } else if (date < today) {
      /* Year absent on the poster — closest plausible occurrence wins. */
      date = new Date(thisYear + 1, month, day);
    }
    found.push({ date, venue: venueNear(text, m.index ?? 0, m[0].length) });
  }
  return found;
}

function eventViewOf(entry: NewsEntry): EventView {
  const dates = eventDatesOf(entry).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextDate = dates.find((d) => d.date >= today)?.date;
  return {
    entry,
    dates,
    nextDate,
    past: dates.length > 0 && !nextDate,
    artists:
      entry.artistIds
        ?.map((id) => artists.find((a) => a.id === id))
        .filter((a): a is ArtistProfile => Boolean(a)) ?? [],
  };
}

const fmtBig = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`;
const fmtCompact = (d: Date) =>
  `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${String(d.getFullYear()).slice(-2)}`;
const isoDay = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/* Upcoming pieces rotate through three editorial compositions. */
const VARIANTS = ["split", "wide", "numbered"] as const;

export default function EditorialPage() {
  const { t } = useI18n();
  const scope = useRef<HTMLDivElement>(null);

  const views = news
    .filter((entry) => entry.kind === "evenement")
    .map(eventViewOf);

  const upcoming = views
    .filter((v) => !v.past)
    .sort(
      (a, b) =>
        (a.nextDate?.getTime() ?? Infinity) -
        (b.nextDate?.getTime() ?? Infinity),
    );
  const past = views
    .filter((v) => v.past)
    .sort(
      (a, b) =>
        (b.dates.at(-1)?.date.getTime() ?? 0) -
        (a.dates.at(-1)?.date.getTime() ?? 0),
    );

  /* The spotlight goes to the next rendez-vous on the calendar. */
  const featured = upcoming[0];
  const rest = upcoming.slice(1);

  /* Page-level SEO — static meta in index.html stays the site default. */
  useEffect(() => {
    document.title = `${t("page.events")} — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${siteConfig.name} — événements : concerts, release parties et rendez-vous du label.`,
      );
  }, [t]);

  /* Hero intro — plays once on mount. */
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
            .from(".ev-hero__char", { yPercent: 110, stagger: 0.04 })
            .from(
              ".ev-hero__rule",
              { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
              "-=0.35",
            )
            .from(
              ".ev-hero__meta > *",
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

  /* Stage — featured parallax + progressive entrances on scroll. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          /* Sections may be absent from the DOM — guard before animating. */
          if (scope.current?.querySelector(".ev-feature")) {
            /* Featured poster drifts gently — depth, not a crop. */
            gsap.fromTo(
              ".ev-feature__poster",
              { yPercent: -3.5 },
              {
                yPercent: 3.5,
                ease: "none",
                scrollTrigger: {
                  trigger: ".ev-feature",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );

            /* Featured body elements cascade in once. */
            gsap.fromTo(
              ".ev-feature__body > *",
              { autoAlpha: 0, y: 26 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.09,
                scrollTrigger: {
                  trigger: ".ev-feature",
                  start: "top 78%",
                  once: true,
                },
              },
            );
          }

          /* Each other upcoming event rises into place. */
          gsap.utils.toArray<HTMLElement>(".ev-piece").forEach((piece) => {
            gsap.fromTo(
              piece,
              { autoAlpha: 0, y: 36 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: piece,
                  start: "top 86%",
                  once: true,
                },
              },
            );
          });

          /* Archive stays discreet — a soft collective fade. */
          if (scope.current?.querySelector(".ev-archive")) {
            gsap.fromTo(
              ".ev-archive__item",
              { autoAlpha: 0, y: 18 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                ease: "power2.out",
                stagger: 0.07,
                scrollTrigger: {
                  trigger: ".ev-archive",
                  start: "top 88%",
                  once: true,
                },
              },
            );
          }

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
      <section className="ev-hero" aria-labelledby="events-title">
        <div className="ev-hero__inner container">
          <p className="label label--accent ev-hero__eyebrow">
            {siteConfig.name}
          </p>

          <h1 id="events-title" className="ev-hero__title">
            <span className="ev-hero__title-mask" aria-hidden="true">
              {t("page.events").split("").map((char, i) => (
                <span key={i} className="ev-hero__char">
                  {char}
                </span>
              ))}
            </span>
            <span className="visually-hidden">Événements</span>
          </h1>

          <div className="ev-hero__meta">
            <span className="ev-hero__rule" aria-hidden="true" />
            <span className="label">{t("events.upcoming")}</span>
            <span className="label ev-hero__count">
              {pad(upcoming.length)}
            </span>
          </div>
        </div>
      </section>

      {views.length === 0 && (
        <p className="label ev__empty container">{t("events.empty")}</p>
      )}

      {/* -------------------------------------------------- À la une --- */}
      {featured && <EvFeature view={featured} />}

      {/* ------------------------------------------- Autres à venir --- */}
      {rest.length > 0 && (
        <section className="ev-list" aria-label={t("events.upcoming")}>
          <div className="ev-list__inner container">
            {rest.map((view, i) => (
              <EvPiece
                key={view.entry.id}
                view={view}
                index={i + 2}
                variant={VARIANTS[i % VARIANTS.length]}
              />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------ Archives */}
      {past.length > 0 && (
        <section className="ev-archive" aria-label={t("events.archive")}>
          <div className="ev-archive__inner container">
            <div className="ev-archive__head">
              <span className="label">{t("events.archive")}</span>
              <span className="ev-archive__rule" aria-hidden="true" />
              <span className="label">{pad(past.length)}</span>
            </div>
            <ul className="ev-archive__list" role="list">
              {past.map((view) => (
                <EvArchiveItem key={view.entry.id} view={view} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * À la une — the next rendez-vous, poster-first immersive composition.
 * ------------------------------------------------------------------------ */

function EvFeature({ view }: { view: EventView }) {
  const { t, pick } = useI18n();
  const { entry } = view;
  const href = entry.url ?? `/editorial/${entry.slug}`;
  const external = Boolean(entry.url);
  return (
    <section className="ev-feature" aria-label={t("events.next")}>
      <div className="ev-feature__inner container">
        <div className="ev-feature__body">
          <p className="label label--accent ev-feature__eyebrow">
            {t("events.next")}
          </p>
          <h2 className="ev-feature__title">{pick(entry.title)}</h2>
          {view.artists.length > 0 && (
            <p className="ev-feature__artist">
              {view.artists.map((a) => a.name).join(" · ")}
            </p>
          )}
          {view.dates.length > 0 && (
            <ul className="ev-feature__dates" role="list">
              {view.dates.map((d) => (
                <li key={isoDay(d.date)} className="ev-feature__date">
                  <time
                    className="ev-feature__day"
                    dateTime={isoDay(d.date)}
                  >
                    {fmtBig(d.date)}
                    <span className="ev-feature__yy">
                      .{String(d.date.getFullYear()).slice(-2)}
                    </span>
                  </time>
                  {d.venue && (
                    <span className="ev-feature__city">{d.venue}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {entry.excerpt && (
            <p className="ev-feature__excerpt">{pick(entry.excerpt)}</p>
          )}
          <a
            className="ev-feature__cta"
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {t("action.consult")}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>

        <div className="ev-feature__stage">
          <span className="ev-feature__ghost" aria-hidden="true">
            01
          </span>
          {entry.coverUrl && (
            <div className="ev-feature__poster">
              <img
                src={entry.coverUrl}
                alt={entry.coverAlt ? pick(entry.coverAlt) : ""}
                decoding="async"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Other upcoming events — each keeps its own composition (split / wide /
 * numbered) so the page never repeats itself.
 * ------------------------------------------------------------------------ */

function EvPiece({
  view,
  index,
  variant,
}: {
  view: EventView;
  index: number;
  variant: (typeof VARIANTS)[number];
}) {
  const { t, pick } = useI18n();
  const { entry } = view;
  const href = entry.url ?? `/editorial/${entry.slug}`;
  const external = Boolean(entry.url);
  return (
    <a
      className={`ev-piece ev-piece--${variant}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {variant === "numbered" && (
        <span className="ev-piece__index" aria-hidden="true">
          {pad(index)}
        </span>
      )}
      <div className="ev-piece__body">
        {view.dates.length > 0 && (
          <p className="ev-piece__dates">
            {view.dates.map((d) => (
              <time
                key={isoDay(d.date)}
                className="ev-piece__date"
                dateTime={isoDay(d.date)}
              >
                {fmtCompact(d.date)}
                {d.venue && (
                  <span className="ev-piece__city"> · {d.venue}</span>
                )}
              </time>
            ))}
          </p>
        )}
        <h3 className="ev-piece__title">{pick(entry.title)}</h3>
        {view.artists.length > 0 && (
          <p className="ev-piece__artist">
            {view.artists.map((a) => a.name).join(" · ")}
          </p>
        )}
        {entry.excerpt && (
          <p className="ev-piece__excerpt">{pick(entry.excerpt)}</p>
        )}
        <span className="ev-piece__cue" aria-hidden="true">
          {t("action.consult")}
          <ArrowRight size={13} />
        </span>
      </div>
      {entry.coverUrl && (
        <span className="ev-piece__poster">
          <img
            src={entry.coverUrl}
            alt={entry.coverAlt ? pick(entry.coverAlt) : ""}
            loading="lazy"
            decoding="async"
          />
        </span>
      )}
    </a>
  );
}

/* --------------------------------------------------------------------------
 * Archive — past events kept quiet: dimmed original posters + caption.
 * ------------------------------------------------------------------------ */

function EvArchiveItem({ view }: { view: EventView }) {
  const { pick } = useI18n();
  const { entry } = view;
  const href = entry.url ?? `/editorial/${entry.slug}`;
  const external = Boolean(entry.url);
  return (
    <li className="ev-archive__item">
      <a
        className="ev-archive__hit"
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {entry.coverUrl && (
          <img
            className="ev-archive__poster"
            src={entry.coverUrl}
            alt={entry.coverAlt ? pick(entry.coverAlt) : ""}
            loading="lazy"
            decoding="async"
          />
        )}
        <span className="ev-archive__meta">
          <span className="ev-archive__title">{pick(entry.title)}</span>
          {view.artists.length > 0 && (
            <span className="ev-archive__artist">
              {view.artists.map((a) => a.name).join(" · ")}
            </span>
          )}
          {view.dates[0] && (
            <time
              className="ev-archive__date"
              dateTime={isoDay(view.dates[0].date)}
            >
              {fmtCompact(view.dates[0].date)}
            </time>
          )}
        </span>
      </a>
    </li>
  );
}
