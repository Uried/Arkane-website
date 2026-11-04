import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  categoryLabels,
  categoryOrder,
  formatPrice,
  products,
  type ProductCategory,
} from "../data/products";
import { siteConfig } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./ShopPage.css";

type CategoryFilter = ProductCategory | "all";

export default function ShopPage() {
  const scope = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<CategoryFilter>("all");

  const available = new Set(
    products.map((p) => p.category).filter(Boolean) as ProductCategory[],
  );
  const filtered = products.filter(
    (p) => category === "all" || p.category === category,
  );

  useEffect(() => {
    document.title = `Boutique — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${siteConfig.name} — boutique officielle : vêtements, accessoires, éditions limitées.`,
      );
  }, []);

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
              {"Boutique".split("").map((char, i) => (
                <span key={i} className="shop-hero__char">
                  {char}
                </span>
              ))}
            </span>
            <span className="visually-hidden">Boutique</span>
          </h1>
          <div className="shop-hero__meta">
            <span className="shop-hero__rule" aria-hidden="true" />
            <span className="label">Merch</span>
            <span className="label shop-hero__count">
              {String(products.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      <section className="shop" aria-label="Catalogue de la boutique">
        <div className="shop__inner container">
          {available.size > 0 && (
            <div
              className="shop-filter"
              role="group"
              aria-label="Filtrer par catégorie"
            >
              <button
                type="button"
                className="shop-filter__btn"
                aria-pressed={category === "all"}
                onClick={() => setCategory("all")}
              >
                Tout
              </button>
              {categoryOrder
                .filter((c) => available.has(c))
                .map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="shop-filter__btn"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {categoryLabels[c]}
                  </button>
                ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="shop__empty">
              <p className="label shop__empty-note">
                {products.length === 0
                  ? "La boutique ouvre bientôt — aucun produit n'est encore en ligne."
                  : "Aucun produit dans cette catégorie."}
              </p>
            </div>
          ) : (
            <ol className="shop-grid" role="list">
              {filtered.map((product) => (
                <li key={product.id} className="shop-tile">
                  <a
                    className="shop-tile__link"
                    href={`/shop/${product.slug}`}
                    aria-label={`${product.name} — ${formatPrice(product.priceCents)}`}
                  >
                    <span className="shop-tile__media">
                      {product.images[0] && (
                        <img
                          className="shop-tile__img"
                          src={product.images[0].url}
                          alt={product.images[0].alt}
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
                        <span className="shop-tile__flag">Épuisé</span>
                      )}
                      {product.limited && (
                        <span className="shop-tile__flag shop-tile__flag--accent">
                          Limité
                        </span>
                      )}
                    </span>
                    <span className="shop-tile__meta">
                      <span className="shop-tile__name">{product.name}</span>
                      <span className="shop-tile__price label">
                        {formatPrice(product.priceCents)}
                      </span>
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
