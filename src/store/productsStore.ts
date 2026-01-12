import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProductsState = {
  favorites: string[]; // productIds
  compare: string[];   // up to 2 productIds

  toggleFavorite: (id: string) => void;

  addCompare: (id: string) => { ok: boolean; reason?: string };
  removeCompare: (id: string) => void;
  clearCompare: () => void;
};

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      favorites: [],
      compare: [],

      toggleFavorite: (id) => {
        set((state) => {
          const exists = state.favorites.includes(id);
          const next = exists ? state.favorites.filter((x) => x !== id) : [id, ...state.favorites];
          return { favorites: next };
        });
      },

      addCompare: (id) => {
        const { compare } = get();
        if (compare.includes(id)) return { ok: true };
        if (compare.length >= 2) return { ok: false, reason: "You can compare only 2 products." };
        set({ compare: [...compare, id] });
        return { ok: true };
      },

      removeCompare: (id) => set((s) => ({ compare: s.compare.filter((x) => x !== id) })),
      clearCompare: () => set({ compare: [] }),
    }),
    {
      name: "ai-skincare-products-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
