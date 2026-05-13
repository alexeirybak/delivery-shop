// store/glossarySettingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GlossarySettings {
  termCount: number;
  includeExamples: boolean;
  includePronunciation: boolean;
  includeRelatedTerms: boolean;
  sortOrder: "alphabetical" | "byCategory" | "byRelevance";
  detailLevel: "compact" | "detailed";
}

interface GlossarySettingsStore {
  settings: GlossarySettings;
  showSettings: boolean;
  updateSetting: <K extends keyof GlossarySettings>(
    key: K,
    value: GlossarySettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: GlossarySettings = {
  termCount: 15,
  includeExamples: true,
  includePronunciation: false,
  includeRelatedTerms: true,
  sortOrder: "alphabetical",
  detailLevel: "compact",
};

export const useGlossarySettingsStore = create<GlossarySettingsStore>()(
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
      name: "glossary-settings",
    },
  ),
);