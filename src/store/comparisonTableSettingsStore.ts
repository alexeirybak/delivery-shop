import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ComparisonTableSettings {
  maxRows: number;
  maxColumns: number;
}

interface ComparisonTableSettingsStore {
  settings: ComparisonTableSettings;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  updateSetting: <K extends keyof ComparisonTableSettings>(
    key: K,
    value: ComparisonTableSettings[K],
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: ComparisonTableSettings = {
  maxRows: 10,
  maxColumns: 6,
};

export const useComparisonTableSettingsStore =
  create<ComparisonTableSettingsStore>()(
    persist(
      (set) => ({
        settings: defaultSettings,
        showSettings: false,

        setShowSettings: (show) => set({ showSettings: show }),

        updateSetting: (key, value) =>
          set((state) => ({
            settings: { ...state.settings, [key]: value },
          })),

        resetSettings: () =>
          set({
            settings: defaultSettings,
          }),
      }),
      {
        name: "comparison-table-settings",
      },
    ),
  );