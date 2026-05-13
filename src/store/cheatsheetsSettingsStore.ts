import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CheatsheetsSettings {
  format: "compact" | "detailed";
  includeExamples: boolean;
  includeFormulas: boolean;
  maxItems: number;
}

interface CheatsheetsSettingsStore {
  settings: CheatsheetsSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof CheatsheetsSettings>(
    key: K,
    value: CheatsheetsSettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: CheatsheetsSettings = {
  format: "compact",
  includeExamples: false,
  includeFormulas: true,
  maxItems: 10,
};

export const useCheatsheetsSettingsStore = create<CheatsheetsSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
      setShowSettings: (show) => set({ showSettings: show }),
    }),
    { name: "cheatsheets-settings" },
  ),
);