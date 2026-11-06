import { useEffect, useRef } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { formatPrice, getProduct } from "../data/products";
import { cartKey, useCart } from "../lib/cart-store";
import "./CartDrawer.css";
import { useI18n } from "../lib/i18n-store";

/** Sliding cart panel — quick adjustments, full recap lives on /shop/panier. */
export default function CartDrawer() {
  const { t, pick } = useI18n();
  const { isOpen, setOpen, items, setQty, remove, count } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  /* Escape closes; focus returns to the trigger naturally via overlay. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  const lines = items
    .map((item) => ({ item, product: getProduct(item.productId) }))
    .filter(
      (l): l is { item: (typeof items)[0]; product: NonNullable<ReturnType<typeof getProduct>> } =>
        Boolean(l.product),
    );
  const subtotal = lines.reduce(
    (sum, l) => sum + (l.product.priceCents ?? 0) * l.item.qty,
    0,
  );

  return (
    <div
      className={`cart-drawer${isOpen ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t("cart.title")}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className="cart-drawer__backdrop"
        aria-label={t("action.close")}
        onClick={() => setOpen(false)}
        tabIndex={isOpen ? 0 : -1}
      />
      <aside className="cart-drawer__panel" ref={panelRef}>
        <div className="cart-drawer__head">
          <p className="label">Panier — {count}</p>
          <button
            type="button"
            className="cart-drawer__close"
            aria-label={t("action.close")}
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="label cart-drawer__empty">{t("cart.empty")}</p>
        ) : (
          <>
            <ul className="cart-drawer__list" role="list">
              {lines.map(({ item, product }) => {
                const variant = product.variants?.find(
                  (v) => v.id === item.variantId,
                );
                return (
                  <li key={cartKey(item)} className="cart-drawer__line">
                    {product.images[0] && (
                      <img
                        className="cart-drawer__thumb"
                        src={product.images[0].url}
                        alt=""
                      />
                    )}
                    <div className="cart-drawer__meta">
                      <p className="cart-drawer__name">{pick(product.name)}</p>
                      {variant && (
                        <p className="cart-drawer__variant label">
                          {pick(variant.label)}
                        </p>
                      )}
                      {product.priceCents != null && (
                        <p className="cart-drawer__price label">
                          {formatPrice(product.priceCents)}
                        </p>
                      )}
                    </div>
                    <div className="cart-drawer__qty">
                      <button
                        type="button"
                        aria-label={t("cart.decrease")}
                        onClick={() => setQty(item, item.qty - 1)}
                        tabIndex={isOpen ? 0 : -1}
                      >
                        <Minus size={13} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        aria-label={t("cart.increase")}
                        onClick={() => setQty(item, item.qty + 1)}
                        tabIndex={isOpen ? 0 : -1}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-drawer__remove"
                      aria-label={`${t("cart.remove")} ${pick(product.name)}`}
                      onClick={() => remove(item)}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="cart-drawer__foot">
              <p className="cart-drawer__total">
                <span className="label">{t("cart.subtotal")}</span>
                <strong>{formatPrice(subtotal)}</strong>
              </p>
              <a
                className="btn btn--solid cart-drawer__checkout"
                href="/shop/panier"
                onClick={() => setOpen(false)}
                tabIndex={isOpen ? 0 : -1}
              >
                Voir le panier
              </a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
