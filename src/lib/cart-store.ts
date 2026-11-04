import { createContext, useContext } from "react";
import type { ShopProduct } from "../data/products";

/** One cart line — variantId ties to ShopProduct.variants[].id. */
export interface CartItem {
  productId: string;
  variantId?: string;
  qty: number;
}

export type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "remove"; key: string }
  | { type: "qty"; key: string; qty: number }
  | { type: "clear" };

export const cartKey = (
  item: Pick<CartItem, "productId" | "variantId">,
): string => `${item.productId}::${item.variantId ?? ""}`;

export const CART_STORAGE_KEY = "arkane-cart";

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function cartReducer(
  items: CartItem[],
  action: CartAction,
): CartItem[] {
  switch (action.type) {
    case "add": {
      const key = cartKey(action.item);
      const existing = items.find((i) => cartKey(i) === key);
      if (existing) {
        return items.map((i) =>
          cartKey(i) === key ? { ...i, qty: i.qty + action.item.qty } : i,
        );
      }
      return [...items, action.item];
    }
    case "remove":
      return items.filter((i) => cartKey(i) !== action.key);
    case "qty":
      return action.qty <= 0
        ? items.filter((i) => cartKey(i) !== action.key)
        : items.map((i) =>
            cartKey(i) === action.key ? { ...i, qty: action.qty } : i,
          );
    case "clear":
      return [];
  }
}

export interface CartContextValue {
  items: CartItem[];
  count: number;
  add: (product: ShopProduct, variantId?: string, qty?: number) => void;
  remove: (item: CartItem) => void;
  setQty: (item: CartItem, qty: number) => void;
  clear: () => void;
  /** Drawer open state — header button + any "added" feedback can open it. */
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
