import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Reveal from "../components/Reveal";
import { categoryLabels, formatPrice, getProduct } from "../data/products";
import { siteConfig } from "../data/site";
import { useCart } from "../lib/cart-store";
import "./ProductPage.css";

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const product = getProduct(slug);
  const { add, setOpen } = useCart();
  const [variantId, setVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id,
  );

  useEffect(() => {
    document.title = product
      ? `${product.name} — ${siteConfig.name}`
      : `Produit introuvable — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        product?.description ??
          `${siteConfig.name} — boutique officielle.`,
      );
  }, [product]);

  if (!product) {
    return (
      <section className="product product--missing">
        <div className="product__inner container">
          <a className="label product__back" href="/shop">
            <ArrowLeft size={14} aria-hidden="true" />
            Boutique
          </a>
          <h1 className="product__name">Produit introuvable.</h1>
          <p className="label product__missing-note">
            Ce produit n'existe pas ou a été retiré.
          </p>
        </div>
      </section>
    );
  }

  const soldOut = product.inStock === false;
  const purchasable = product.inStock === true;

  return (
    <article className="product">
      <div className="product__inner container">
        <a className="label product__back" href="/shop">
          <ArrowLeft size={14} aria-hidden="true" />
          Boutique
        </a>

        <div className="product__layout">
          <Reveal>
            <div className="product__media">
              {product.images[0] && (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alt}
                  style={
                    {
                      "--product-object":
                        product.images[0].position ?? "50% 40%",
                    } as CSSProperties
                  }
                />
              )}
            </div>
          </Reveal>

          <div className="product__side">
            <Reveal delay={80}>
              <div className="product__tags">
                {product.category && (
                  <span className="product__tag">
                    {categoryLabels[product.category]}
                  </span>
                )}
                {product.limited && (
                  <span className="product__tag product__tag--accent">
                    Édition limitée
                  </span>
                )}
              </div>
              <h1 className="product__name">{product.name}</h1>
              <p className="product__price">{formatPrice(product.priceCents)}</p>
            </Reveal>

            {product.description && (
              <Reveal delay={140}>
                <p className="product__desc">{product.description}</p>
              </Reveal>
            )}

            {product.variants && product.variants.length > 0 && (
              <Reveal delay={180}>
                <fieldset className="product__variants">
                  <legend className="label">Option</legend>
                  <div className="product__variant-list">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        className="product__variant"
                        aria-pressed={variantId === variant.id}
                        onClick={() => setVariantId(variant.id)}
                      >
                        {variant.label}
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
                  Ajouter au panier
                </button>
                {!purchasable && (
                  <p className="product__stock-note label">
                    {soldOut ? "Épuisé" : "Bientôt disponible"}
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
