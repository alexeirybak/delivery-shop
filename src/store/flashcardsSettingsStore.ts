import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FlashcardsSettings {
  cardCount: number;
  difficulty: "easy" | "medium" | "hard";
  answerMode: "short" | "detailed";
  includeExamples: boolean;
}

interface FlashcardsSettingsStore {
  settings: FlashcardsSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof FlashcardsSettings>(
    key: K,
    value: FlashcardsSettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: FlashcardsSettings = {
  cardCount: 10,
  difficulty: "medium",
  answerMode: "short",
  includeExamples: true,
};

export const useFlashcardsSettingsStore = create<FlashcardsSettingsStore>()(
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
      name: "flashcards-settings",
    },
  ),
);
