import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LectureSettings {
  targetAudience: string;
  level: string;
  duration: string;
  includeGoal: boolean;
  includeOutline: boolean;
  includeKeyTerms: boolean;
  includeExamples: boolean;
  includeSummary: boolean;
  includeQuestions: boolean;
  includeReferences: boolean;
  style: string;
  focusAreas: string;
}

interface LectureSettingsStore {
  settings: LectureSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof LectureSettings>(
    key: K,
    value: LectureSettings[K]
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: LectureSettings = {
  targetAudience: "students_bachelor",
  level: "intermediate",
  duration: "45",
  includeGoal: true,
  includeOutline: true,
  includeKeyTerms: false,
  includeExamples: true,
  includeSummary: true,
  includeQuestions: false,
  includeReferences: true,
  style: "academic",
  focusAreas: "",
};

export const useLectureSettingsStore = create<LectureSettingsStore>()(
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
      name: "lecture-settings",
    }
  )
);