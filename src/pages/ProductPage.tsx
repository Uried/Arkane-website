import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Reveal from "../components/Reveal";
import { formatPrice, getProduct } from "../data/products";
import { siteConfig } from "../data/site";
import { useCart } from "../lib/cart-store";
import "./ProductPage.css";
import type { DictKey } from "../i18n/dict";
import { useI18n } from "../lib/i18n-store";

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const { t, pick } = useI18n();
  const product = getProduct(slug);
  const { add, setOpen } = useCart();
  const [variantId, setVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id,
  );
  const [imageIndex, setImageIndex] = useState(0);

  /* Reset selection when navigating between products (adjust-during-render). */
  const [prevSlug, setPrevSlug] = useState(slug);
  if (prevSlug !== slug) {
    setPrevSlug(slug);
    setVariantId(product?.variants?.[0]?.id);
    setImageIndex(0);
  }

  useEffect(() => {
    document.title = product
      ? `${pick(product.name)} — ${siteConfig.name}`
      : `${t("shop.missing")} ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        product?.description
          ? pick(product.description)
          : `${siteConfig.name} — boutique officielle.`,
      );
  }, [product, t, pick]);

  if (!product) {
    return (
      <section className="product product--missing">
        <div className="product__inner container">
          <a className="label product__back" href="/shop">
            <ArrowLeft size={14} aria-hidden="true" />
            {t("shop.back")}
          </a>
          <h1 className="product__name">Produit introuvable.</h1>
          <p className="label product__missing-note">
            {t("shop.missingNote")}
          </p>
        </div>
      </section>
    );
  }

  const soldOut = product.inStock === false;
  const purchasable = product.inStock === true;
  const activeImage = product.images[imageIndex] ?? product.images[0];

  return (
    <article className="product">
      <div className="product__inner container">
        <a className="label product__back" href="/shop">
          <ArrowLeft size={14} aria-hidden="true" />
          {t("shop.back")}
        </a>

        <div className="product__layout">
          <div className="product__gallery">
            <Reveal>
              <div className="product__media">
                {activeImage && (
                  <img
                    src={activeImage.url}
                    alt={pick(activeImage.alt)}
                    style={
                      {
                        "--product-object":
                          activeImage.position ?? "50% 40%",
                      } as CSSProperties
                    }
                  />
                )}
              </div>
            </Reveal>

            {product.images.length > 1 && (
              <div
                className="product__thumbs"
                role="group"
                aria-label={t("shop.gallery")}
              >
                {product.images.map((image, i) => (
                  <button
                    key={i}
                    type="button"
                    className="product__thumb"
                    aria-pressed={i === imageIndex}
                    aria-label={`${t("shop.viewOf")} ${i + 1}`}
                    onClick={() => setImageIndex(i)}
                  >
                    <img
                      src={image.url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product__side">
            <Reveal delay={80}>
              <div className="product__tags">
                <span
                  className={`product__tag${product.limited ? " product__tag--accent" : ""}`}
                >
                  {t(`col.${product.collection}` as DictKey)}
                </span>
                {product.category && (
                  <span className="product__tag">
                    {t(`cat.${product.category}` as DictKey)}
                  </span>
                )}
                {product.limited && (
                  <span className="product__tag product__tag--accent">
                    {t("shop.limited")}
                  </span>
                )}
              </div>
              <h1 className="product__name">{pick(product.name)}</h1>
              {product.priceCents != null && (
                <p className="product__price">
                  {formatPrice(product.priceCents)}
                </p>
              )}
            </Reveal>

            {product.description && (
              <Reveal delay={140}>
                <p className="product__desc">{pick(product.description)}</p>
              </Reveal>
            )}

            {product.variants && product.variants.length > 0 && (
              <Reveal delay={180}>
                <fieldset className="product__variants">
                  <legend className="label">{t("shop.option")}</legend>
                  <div className="product__variant-list">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        className="product__variant"
                        aria-pressed={variantId === variant.id}
                        onClick={() => setVariantId(variant.id)}
                      >
                        {pick(variant.label)}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </Reveal>
            )}

            <Reveal delay={220}>
              <div className="product__cta">
                <button
                  type="button"
                  className="btn btn--solid product__add"
                  disabled={!purchasable}
                  onClick={() => {
                    add(product, variantId);
                    setOpen(true);
                  }}
                >
                  <ShoppingBag size={15} aria-hidden="true" />
                  {t("shop.add")}
                </button>
                {!purchasable && (
                  <p className="product__stock-note label">
                    {soldOut ? t("shop.soldOut") : t("shop.soon")}
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}
