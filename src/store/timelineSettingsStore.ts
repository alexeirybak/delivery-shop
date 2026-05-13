import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TimelineSettings {
  maxEvents: number;
  sortOrder: "asc" | "desc";
  dateFormat: "full" | "monthYear" | "year";
  topic?: string;
}

export interface TimelineSettingsStore {
  settings: TimelineSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof TimelineSettings>(
    key: K,
    value: TimelineSettings[K]
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: TimelineSettings = {
  maxEvents: 15,
  sortOrder: "asc",
  dateFormat: "full",
};

export const useTimelineSettingsStore = create<TimelineSettingsStore>()(
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
    {
      name: "timeline-settings",
    }
  )
);