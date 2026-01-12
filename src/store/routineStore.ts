import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RoutineSlot = "AM" | "PM";

export type RoutineEntry = {
  productId: string;
  step: string; // Cleanser/Serum/Treatment/Moisturizer/SPF
};

type RoutineState = {
  am: RoutineEntry[];
  pm: RoutineEntry[];
  addToRoutine: (slot: RoutineSlot, entry: RoutineEntry) => void;
  removeFromRoutine: (slot: RoutineSlot, productId: string) => void;
  clearRoutine: () => void;
};

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      am: [],
      pm: [],
      addToRoutine: (slot, entry) =>
        set((state) => {
          const list = slot === "AM" ? state.am : state.pm;

          // prevent duplicates
          const exists = list.some((x) => x.productId === entry.productId);
          if (exists) return state;

          // keep same step unique: replace same step if exists
          const filtered = list.filter((x) => x.step !== entry.step);
          const next = [...filtered, entry];

          return slot === "AM" ? { am: next } : { pm: next };
        }),
      removeFromRoutine: (slot, productId) =>
        set((state) => {
          const list = slot === "AM" ? state.am : state.pm;
          const next = list.filter((x) => x.productId !== productId);
          return slot === "AM" ? { am: next } : { pm: next };
        }),
      clearRoutine: () => set({ am: [], pm: [] }),
    }),
    {
      name: "ai-skincare-routine-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
