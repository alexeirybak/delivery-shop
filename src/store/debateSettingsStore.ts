import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DebateFormat = "classical" | "parliamentary" | "lincoln_douglas" | "sparring";
export type DebateDifficulty = "beginner" | "intermediate" | "advanced";

export interface DebateSettings {
  format: DebateFormat;
  duration: number;
  participantsCount: number;
  difficulty: DebateDifficulty;
  includeOpening: boolean;
  includeRebuttals: boolean;
  includeCrossExamination: boolean;
  includeClosing: boolean;
  includeJudging: boolean;
  includeArguments: boolean;
  includeCounterArguments: boolean;
  includeEvidence: boolean;
  includeExamples: boolean;
  topic?: string;
}

export interface DebateSettingsStore {
  settings: DebateSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof DebateSettings>(
    key: K,
    value: DebateSettings[K]
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: DebateSettings = {
  format: "classical",
  duration: 60,
  participantsCount: 2,
  difficulty: "intermediate",
  includeOpening: true,
  includeRebuttals: true,
  includeCrossExamination: true,
  includeClosing: true,
  includeJudging: true,
  includeArguments: true,
  includeCounterArguments: true,
  includeEvidence: true,
  includeExamples: true,
};

export const useDebateSettingsStore = create<DebateSettingsStore>()(
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
      name: "debate-settings",
    }
  )
);