import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types";

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  getTotal: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const exists = state.items.find((item) => item.id === product.id);
          if (exists) return state;
          return {
            items: [...state.items, product],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      toggleItem: (product) => {
        set((state) => {
          const exists = state.items.find((item) => item.id === product.id);
          if (exists) {
            return {
              items: state.items.filter((item) => item.id !== product.id),
            };
          }
          return {
            items: [...state.items, product],
          };
        });
      },

      isWishlisted: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ items: [] }),

      getTotal: () => {
        return get().items.length;
      },
    }),
    {
      name: "wishlist-store",
    },
  ),
);
