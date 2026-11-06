import { useEffect, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { artists } from "../data/artists";
import { getNews, sortedNews, type NewsEntry } from "../data/news";
import { getRelease } from "../data/releases";
import { siteConfig } from "../data/site";
import "./ArticlePage.css";
import type { DictKey } from "../i18n/dict";
import { useI18n } from "../lib/i18n-store";

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function applyArticleMeta(
  article: NewsEntry | undefined,
  missing: string,
  pick: ReturnType<typeof useI18n>["pick"],
) {
  document.title = article
    ? `${pick(article.title)} — ${siteConfig.name}`
    : `${missing} ${siteConfig.name}`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      "content",
      article?.excerpt ? pick(article.excerpt) : `${siteConfig.name} — actualité.`,
    );
}

interface ArticlePageProps {
  slug: string;
}

export default function ArticlePage({ slug }: ArticlePageProps) {
  const { t, pick } = useI18n();
  const article = getNews(slug);

  const sorted = sortedNews();
  const index = sorted.findIndex((entry) => entry.id === article?.id);
  const prev = index > 0 ? sorted[index - 1] : undefined;
  const next =
    index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined;

  const linkedArtists =
    article?.artistIds
      ?.map((id) => artists.find((a) => a.id === id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a)) ?? [];
  const linkedReleases =
    article?.releaseIds
      ?.map(getRelease)
      .filter((r): r is NonNullable<typeof r> => Boolean(r)) ?? [];

  useEffect(() => {
    applyArticleMeta(article, t("news.missing"), pick);
  }, [article, t, pick]);

  if (!article) {
    return (
      <section className="article article--missing">
        <div className="article__inner container">
          <a className="label article__back" href="/editorial">
            <ArrowLeft size={14} aria-hidden="true" />
            {t("news.back")}
          </a>
          <h1 className="article__title">Actualité introuvable.</h1>
          <p className="label article__missing-note">
            {t("news.missingNote")}
          </p>
        </div>
      </section>
    );
  }

  const date = formatDate(article.publishedAt);

  return (
    <article className="article">
      <div className="article__inner container">
        <a className="label article__back" href="/editorial">
          <ArrowLeft size={14} aria-hidden="true" />
          {t("news.back")}
        </a>

        <header className="article__header">
          <Reveal>
            <div className="article__meta">
              <span className="article__kind">
                {t(`kind.${article.kind}` as DictKey)}
              </span>
              {date && <span className="article__date label">{date}</span>}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="article__title">{pick(article.title)}</h1>
          </Reveal>
          {article.excerpt && (
            <Reveal delay={140}>
              <p className="article__excerpt">{pick(article.excerpt)}</p>
            </Reveal>
          )}
        </header>

        {article.coverUrl && (
          <Reveal delay={180}>
            <figure className="article__cover">
              <img
                src={article.coverUrl}
                alt={article.coverAlt ? pick(article.coverAlt) : ""}
                style={
                  {
                    "--article-object": article.coverPosition ?? "50% 40%",
                  } as CSSProperties
                }
              />
            </figure>
          </Reveal>
        )}

        {article.body && article.body.length > 0 && (
          <Reveal delay={220}>
            <div className="article__body">
              {article.body.map((paragraph, i) => (
                <p key={i}>{pick(paragraph)}</p>
              ))}
            </div>
          </Reveal>
        )}

        {(linkedArtists.length > 0 || linkedReleases.length > 0) && (
          <Reveal delay={260}>
            <div className="article__related">
              {linkedArtists.map((artist) => (
                <a
                  key={artist.id}
                  className="article__related-link"
                  href="/artists"
                >
                  {artist.name}
                  <ArrowRight size={12} aria-hidden="true" />
                </a>
              ))}
              {linkedReleases.map((release) => (
                <a
                  key={release.id}
                  className="article__related-link"
                  href="/releases"
                >
                  {release.title}
                  <ArrowRight size={12} aria-hidden="true" />
                </a>
              ))}
            </div>
          </Reveal>
        )}

        {(prev || next) && (
          <nav className="article__nav" aria-label={t("news.adjacent")}>
            {prev ? (
              <a className="article__nav-link" href={`/editorial/${prev.slug}`}>
                <span className="label">{t("action.prev")}</span>
                <span className="article__nav-title">{pick(prev.title)}</span>
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a
                className="article__nav-link article__nav-link--next"
                href={`/editorial/${next.slug}`}
              >
                <span className="label">{t("action.next")}</span>
                <span className="article__nav-title">{pick(next.title)}</span>
              </a>
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
