import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CreditSettings {
  questionCount: string;
  level: string;
  includeAnswers: boolean;
  evaluationCriteria: string;
}

interface CreditSettingsStore {
  settings: CreditSettings;
  updateSetting: <K extends keyof CreditSettings>(
    key: K,
    value: CreditSettings[K],
  ) => void;
  resetSettings: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: CreditSettings = {
  questionCount: "20",
  level: "intermediate",
  includeAnswers: false,
  evaluationCriteria: "",
};

export const useCreditSettingsStore = create<CreditSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      setShowSettings: (show) => set({ showSettings: show }),
      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "credit-settings",
    },
  ),
);
