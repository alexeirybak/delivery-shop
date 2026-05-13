import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SolutionSettings {
  discipline: string;
  subject: string;
  educationLevel: string;
  detailLevel: "simple" | "normal" | "expert";
  showSteps: boolean;
  provideExamples: boolean;
  useFormulas: boolean;
}

interface SolutionSettingsStore {
  settings: SolutionSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof SolutionSettings>(
    key: K,
    value: SolutionSettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: SolutionSettings = {
  discipline: "mathematics",
  subject: "",
  educationLevel: "school_10",
  detailLevel: "normal",
  showSteps: true,
  provideExamples: true,
  useFormulas: true,
};

export const useSolutionSettingsStore = create<SolutionSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
      setShowSettings: (showSettings) => set({ showSettings }),
    }),
    {
      name: "solution-settings",
    },
  ),
);
