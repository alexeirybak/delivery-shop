import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RoadmapSettings {
  maxPhases: number;
  maxTasks: number;
}

interface RoadmapSettingsStore {
  settings: RoadmapSettings;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  updateSetting: <K extends keyof RoadmapSettings>(
    key: K,
    value: RoadmapSettings[K],
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: RoadmapSettings = {
  maxPhases: 6,
  maxTasks: 4,
};

export const useRoadmapSettingsStore = create<RoadmapSettingsStore>()(
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
      name: "roadmap-settings",
    },
  ),
);
