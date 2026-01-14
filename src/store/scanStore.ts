import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ScanResult = {
    id: string;
    skin_type: string;
    acne_level: string;
    oiliness: string;
    dryness: string;
    redness: string;
    dark_circles: string;
    fine_lines: string;
    pores: string;
    overall_skin_health: string;
    skincare_advice?: string[];
    capturedUri?: string;
    face_detected?: boolean;
    confidence_scores?: any;
    scannedAt: string;
  // ✅ new
  concerns?: { key: string; score: number }[]; // e.g. [{key:'acne', score:0.72}]
  recommended_products?: { name: string; brand: string,reason:string,type:string }[]; // e.g. [{key:'acne', score:0.72}]
  avoidTags?: string[]; // e.g. ['fragrance','alcohol_denat']
};

type ScanState = {
  latest: ScanResult | null;
  history: ScanResult[]; // newest first

  addScan: (r: Omit<ScanResult, "id">) => ScanResult;

  removeScan: (id: string) => void;
  clearAll: () => void;

  // reminders
  reminderEnabled: boolean;
  reminderNotificationId: string | null;
  setReminder: (enabled: boolean, notificationId: string | null) => void;
};

const MAX_HISTORY = 10;

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set, get) => ({
      latest: null,
      history: [],

      addScan: (r) => {
        const full: ScanResult = { ...r, id: makeId() };
        set((state) => {
          const nextHistory = [full, ...state.history].slice(0, MAX_HISTORY);
          return { latest: full, history: nextHistory };
        });
        return full;
      },

      removeScan: (id) => {
        set((state) => {
          const nextHistory = state.history.filter((x) => x.id !== id);
          const nextLatest = state.latest?.id === id ? nextHistory[0] ?? null : state.latest;
          return { history: nextHistory, latest: nextLatest };
        });
      },

      clearAll: () => set({ latest: null, history: [] }),

      reminderEnabled: false,
      reminderNotificationId: null,
      setReminder: (enabled, notificationId) =>
        set({ reminderEnabled: enabled, reminderNotificationId: notificationId }),
    }),
    {
      name: "ai-skincare-scan-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 3,
      migrate: (persisted: any) => {
        // v1: { latest }
        // v2: { latest, history }
        // v3: add reminder fields
        const base = persisted ?? {};
        const latest = base.latest ?? null;
        const history = base.history ?? (latest ? [latest] : []);
        return {
          latest,
          history,
          reminderEnabled: base.reminderEnabled ?? false,
          reminderNotificationId: base.reminderNotificationId ?? null,
        };
      },
    }
  )
);
