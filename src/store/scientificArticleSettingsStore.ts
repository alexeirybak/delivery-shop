import { create } from "zustand";
import { persist } from "zustand/middleware";

import { initialScientificArticleSettings } from "@/app/(user-part)/user-dashboard/science/utils/initialScientificArticleSettings";

export interface ArticleSettings {
  articleLength: number;
  includeAbstract: boolean;
  abstractLength: number;
  includeEnglishAbstract: boolean;
  includeKeywords: boolean;
  keywordsCount: number;
  includeEnglishKeywords: boolean;
  includeUdk: boolean;
  includeBbk: boolean;
  referencesCount: number;
}

interface ScientificArticleSettingsStore {
  settings: ArticleSettings;
  showSettings: boolean;
  setSettings: (settings: ArticleSettings) => void;
  updateSetting: <K extends keyof ArticleSettings>(
    key: K,
    value: ArticleSettings[K],
  ) => void;
  resetSettings: () => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

export const useScientificArticleSettingsStore =
  create<ScientificArticleSettingsStore>()(
    persist(
      (set) => ({
        settings: initialScientificArticleSettings,
        showSettings: false,

        setSettings: (newSettings) => set({ settings: newSettings }),

        updateSetting: (key, value) =>
          set((state) => ({
            settings: {
              ...state.settings,
              [key]: value,
            },
          })),

        resetSettings: () =>
          set({ settings: initialScientificArticleSettings }),

        toggleSettings: () =>
          set((state) => ({ showSettings: !state.showSettings })),

        setShowSettings: (show) => set({ showSettings: show }),
      }),
      {
        name: "article-settings-storage",
      },
    ),
  );
