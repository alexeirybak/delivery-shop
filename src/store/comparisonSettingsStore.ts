import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ComparisonSettings {
  depth: "basic" | "detailed" | "expert";
  maxItems: number;
  includeSources: boolean;
  aspects: {
    similarities: boolean;
    differences: boolean;
    advantages: boolean;
    disadvantages: boolean;
    examples: boolean;
    conclusions: boolean;
  };
  format: "paragraphs" | "list";
  topic?: string;
}

export interface ComparisonSettingsStore {
  settings: ComparisonSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof ComparisonSettings>(
    key: K,
    value: ComparisonSettings[K]
  ) => void;
  updateAspect: (key: keyof ComparisonSettings["aspects"], value: boolean) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: ComparisonSettings = {
  depth: "detailed",
  aspects: {
    similarities: true,
    differences: true,
    advantages: true,
    disadvantages: true,
    examples: true,
    conclusions: true,
  },
  format: "paragraphs",
  maxItems: 10,
  includeSources: false,
};

export const useComparisonSettingsStore = create<ComparisonSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      updateAspect: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            aspects: { ...state.settings.aspects, [key]: value },
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
      setShowSettings: (show) => set({ showSettings: show }),
    }),
    {
      name: "comparison-settings",
    }
  )
);