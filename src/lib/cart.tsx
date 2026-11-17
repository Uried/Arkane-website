import {
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  CartContext,
  cartKey,
  cartReducer,
  loadCart,
  type CartContextValue,
} from "./cart-store";
import { getProduct } from "../data/products";

/** Cart state provider — persists to localStorage, drives the drawer. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [isOpen, setOpen] = useState(false);

  /* Drop persisted lines whose product no longer exists — the badge counted
   * them while the drawer filtered them out (ghost count bug). */
  useEffect(() => {
    items.forEach((item) => {
      if (!getProduct(item.productId)) {
        dispatch({ type: "remove", key: cartKey(item) });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time prune
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart still works in memory */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      add: (product, variantId, qty = 1) =>
        dispatch({
          type: "add",
          item: { productId: product.id, variantId, qty },
        }),
      remove: (item) => dispatch({ type: "remove", key: cartKey(item) }),
      setQty: (item, qty) =>
        dispatch({ type: "qty", key: cartKey(item), qty }),
      clear: () => dispatch({ type: "clear" }),
      isOpen,
      setOpen,
    }),
    [items, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
