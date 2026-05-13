import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RadarChartSettings {
  maxAxes: number;
}

interface RadarChartSettingsStore {
  settings: RadarChartSettings;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  updateSetting: <K extends keyof RadarChartSettings>(
    key: K,
    value: RadarChartSettings[K],
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: RadarChartSettings = {
  maxAxes: 6,
};

export const useRadarChartSettingsStore = create<RadarChartSettingsStore>()(
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
      name: "radar-chart-settings",
    },
  ),
);
