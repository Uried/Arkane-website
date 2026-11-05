import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice, getProduct } from "../data/products";
import { siteConfig } from "../data/site";
import { cartKey, useCart } from "../lib/cart-store";
import "./CartPage.css";
import { useI18n } from "../lib/i18n-store";

export default function CartPage() {
  const { t } = useI18n();
  const { items, setQty, remove, count } = useCart();
  const [status, setStatus] = useState<"idle" | "unavailable">("idle");

  useEffect(() => {
    document.title = `${t("cart.title")} — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", `${siteConfig.name} — panier.`);
  }, [t]);

  const lines = items
    .map((item) => ({ item, product: getProduct(item.productId) }))
    .filter((l): l is { item: (typeof items)[0]; product: NonNullable<ReturnType<typeof getProduct>> } =>
      Boolean(l.product),
    );
  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.priceCents * l.item.qty,
    0,
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    /* No backend/payment yet — honest state, never a fake confirmation. */
    setStatus("unavailable");
  };

  return (
    <div className="cart">
      <section className="cart__inner container">
        <a className="label cart__back" href="/shop">
          <ArrowLeft size={14} aria-hidden="true" />
          {t("shop.back")}
        </a>
        <h1 className="cart__title">{t("cart.title")}</h1>

        {lines.length === 0 ? (
          <p className="label cart__empty">{t("cart.empty")}</p>
        ) : (
          <div className="cart__layout">
            <ul className="cart__list" role="list">
              {lines.map(({ item, product }) => {
                const variant = product.variants?.find(
                  (v) => v.id === item.variantId,
                );
                return (
                  <li key={cartKey(item)} className="cart-line">
                    {product.images[0] && (
                      <img
                        className="cart-line__thumb"
                        src={product.images[0].url}
                        alt=""
                      />
                    )}
                    <div className="cart-line__meta">
                      <p className="cart-line__name">{product.name}</p>
                      {variant && (
                        <p className="cart-line__variant label">
                          {variant.label}
                        </p>
                      )}
                      <p className="cart-line__price label">
                        {formatPrice(product.priceCents)}
                      </p>
                    </div>
                    <div className="cart-line__qty">
                      <button
                        type="button"
                        aria-label={`${t("cart.decrease")} — ${product.name}`}
                        onClick={() => setQty(item, item.qty - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-live="polite">{item.qty}</span>
                      <button
                        type="button"
                        aria-label={`${t("cart.increase")} — ${product.name}`}
                        onClick={() => setQty(item, item.qty + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-line__remove"
                      aria-label={`${t("cart.remove")} ${product.name}`}
                      onClick={() => remove(item)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                );
              })}
            </ul>

            <form className="cart__order" onSubmit={onSubmit}>
              <p className="cart__total">
                <span className="label">{t("cart.subtotal")} ({count})</span>
                <strong>{formatPrice(subtotal)}</strong>
              </p>
              <p className="label cart__note">
                Livraison et paiement seront précisés à l'ouverture de la
                boutique.
              </p>
              <button type="submit" className="btn btn--solid cart__submit">
                {t("action.order")}
              </button>
              {status === "unavailable" && (
                <p className="cart__status" role="status">
                  Le canal de commande sera bientôt disponible — ton panier est
                  conservé, réessaie plus tard.
                </p>
              )}
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
