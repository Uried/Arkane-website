import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import {
  categoryOrder,
  collectionOrder,
  formatPrice,
  products,
  type ProductCategory,
  type ProductCollection,
} from "../data/products";
import { siteConfig } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./ShopPage.css";
import type { DictKey } from "../i18n/dict";
import { useI18n } from "../lib/i18n-store";

type CollectionFilter = ProductCollection | "all";
type CategoryFilter = ProductCategory | "all";

export default function ShopPage() {
  const { t, pick } = useI18n();
  const scope = useRef<HTMLDivElement>(null);
  const [collection, setCollection] = useState<CollectionFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const availableCollections = new Set(products.map((p) => p.collection));
  const availableCategories = new Set(
    products
      .filter((p) => collection === "all" || p.collection === collection)
      .map((p) => p.category)
      .filter(Boolean) as ProductCategory[],
  );

  const filtered = products.filter(
    (p) =>
      (collection === "all" || p.collection === collection) &&
      (category === "all" || p.category === category),
  );

  const countFor = (c: ProductCollection) =>
    products.filter((p) => p.collection === c).length;

  useEffect(() => {
    document.title = `${t("page.shop")} — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${siteConfig.name} — boutique officielle : vêtements, accessoires, éditions limitées.`,
      );
  }, [t]);

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
            .from(".shop-hero__char", { yPercent: 110, stagger: 0.05 })
            .from(
              ".shop-hero__rule",
              { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
              "-=0.35",
            )
            .from(
              ".shop-hero__meta > *",
              { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.08 },
              "-=0.25",
            )
            .from(
              ".shop-hero__intro",
              { autoAlpha: 0, y: 14, duration: 0.5 },
              "-=0.2",
            );

          gsap.fromTo(
            ".shop-tile",
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
              scrollTrigger: {
                trigger: ".shop-grid",
                start: "top 88%",
                once: true,
              },
            },
          );

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
      <section className="shop-hero" aria-labelledby="shop-title">
        <div className="shop-hero__inner container">
          <p className="label label--accent shop-hero__eyebrow">
            {siteConfig.name}
          </p>
          <h1 id="shop-title" className="shop-hero__title">
            <span className="shop-hero__title-mask" aria-hidden="true">
              {t("page.shop").split("").map((char, i) => (
                <span key={i} className="shop-hero__char">
                  {char}
                </span>
              ))}
            </span>
            <span className="visually-hidden">Boutique</span>
          </h1>
          <div className="shop-hero__meta">
            <span className="shop-hero__rule" aria-hidden="true" />
            {collectionOrder
              .filter((c) => availableCollections.has(c))
              .map((c) => (
                <span key={c} className="label">
                  {t(`col.${c}` as DictKey)} —{" "}
                  {String(countFor(c)).padStart(2, "0")}
                </span>
              ))}
            <span className="label shop-hero__count">
              {String(products.length).padStart(2, "0")}
            </span>
          </div>
          <p className="shop-hero__intro">{t("shop.intro")}</p>
        </div>
      </section>

      <section className="shop" aria-label="Catalogue de la boutique">
        <div className="shop__inner container">
          {availableCollections.size > 0 && (
            <div
              className="shop-filter shop-filter--collections"
              role="group"
              aria-label={t("shop.collections")}
            >
              <button
                type="button"
                className="shop-filter__btn"
                aria-pressed={collection === "all"}
                onClick={() => {
                  setCollection("all");
                  setCategory("all");
                }}
              >
                {t("action.all")}
              </button>
              {collectionOrder
                .filter((c) => availableCollections.has(c))
                .map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="shop-filter__btn"
                    aria-pressed={collection === c}
                    onClick={() => {
                      setCollection(c);
                      setCategory("all");
                    }}
                  >
                    {t(`col.${c}` as DictKey)}
                  </button>
                ))}
            </div>
          )}

          {availableCategories.size > 0 && (
            <div
              className="shop-filter"
              role="group"
              aria-label={t("shop.filter")}
            >
              <button
                type="button"
                className="shop-filter__btn shop-filter__btn--sub"
                aria-pressed={category === "all"}
                onClick={() => setCategory("all")}
              >
                {t("action.all")}
              </button>
              {categoryOrder
                .filter((c) => availableCategories.has(c))
                .map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="shop-filter__btn shop-filter__btn--sub"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {t(`cat.${c}` as DictKey)}
                  </button>
                ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="shop__empty">
              <p className="label shop__empty-note">
                {products.length === 0
                  ? t("shop.empty")
                  : t("shop.emptyCat")}
              </p>
            </div>
          ) : (
            <ol className="shop-grid" role="list">
              {filtered.map((product) => (
                <li key={product.id} className="shop-tile">
                  <a
                    className="shop-tile__link"
                    href={`/shop/${product.slug}`}
                    aria-label={pick(product.name)}
                  >
                    <span className="shop-tile__media">
                      {product.images[0] && (
                        <img
                          className="shop-tile__img"
                          src={product.images[0].url}
                          alt={pick(product.images[0].alt)}
                          loading="lazy"
                          decoding="async"
                          style={
                            {
                              "--shop-object":
                                product.images[0].position ?? "50% 40%",
                            } as CSSProperties
                          }
                        />
                      )}
                      {product.inStock === false && (
                        <span className="shop-tile__flag">{t("shop.soldOut")}</span>
                      )}
                      {product.limited && (
                        <span className="shop-tile__flag shop-tile__flag--accent">
                          {t("shop.limited")}
                        </span>
                      )}
                      <span className="shop-tile__discover label">
                        {t("shop.discover")}
                        <ArrowRight size={13} aria-hidden="true" />
                      </span>
                    </span>
                    <span className="shop-tile__meta">
                      <span className="shop-tile__id">
                        <span className="shop-tile__collection label">
                          {t(`col.${product.collection}` as DictKey)}
                        </span>
                        <span className="shop-tile__name">
                          {pick(product.name)}
                        </span>
                      </span>
                      {product.priceCents != null && (
                        <span className="shop-tile__price label">
                          {formatPrice(product.priceCents)}
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
