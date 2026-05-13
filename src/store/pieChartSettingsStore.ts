import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PieChartSettings {
  maxSectors: number;
}

interface PieChartSettingsStore {
  settings: PieChartSettings;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  updateSetting: <K extends keyof PieChartSettings>(
    key: K,
    value: PieChartSettings[K],
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: PieChartSettings = {
  maxSectors: 6,
};

export const usePieChartSettingsStore = create<PieChartSettingsStore>()(
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
      name: "pie-chart-settings",
    },
  ),
);
