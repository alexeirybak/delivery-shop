import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HomeworkSettings {
  subject: string;
  grade: string;
  strictness: string;
  includeExplanation: boolean;
}

interface HomeworkSettingsStore {
  settings: HomeworkSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof HomeworkSettings>(
    key: K,
    value: HomeworkSettings[K]
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: HomeworkSettings = {
  subject: "",
  grade: "5",
  strictness: "normal",
  includeExplanation: true,
};

export const useHomeworkSettingsStore = create<HomeworkSettingsStore>()(
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
      name: "homework-settings",
    }
  )
);