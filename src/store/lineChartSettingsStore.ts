import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LineChartSettings {
  maxPoints: number;
}

interface LineChartSettingsStore {
  settings: LineChartSettings;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  updateSetting: <K extends keyof LineChartSettings>(
    key: K,
    value: LineChartSettings[K],
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: LineChartSettings = {
  maxPoints: 10,
};

export const useLineChartSettingsStore = create<LineChartSettingsStore>()(
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
      name: "line-chart-settings",
    },
  ),
);
