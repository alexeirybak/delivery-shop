import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ExamsSettings {
  examType: string;
  level: string;
  duration: string;
  questionCount: string;
  passingScore: string;
  gradingScale: string;
  includeTheory: boolean;
  includePractice: boolean;
  includeTest: boolean;
  includeCases: boolean;
  evaluationCriteria: string;
  allowedMaterials: string;
}

interface ExamsSettingsStore {
  settings: ExamsSettings;
  updateSetting: <K extends keyof ExamsSettings>(key: K, value: ExamsSettings[K]) => void;
  resetSettings: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: ExamsSettings = {
  examType: "final",
  level: "intermediate",
  duration: "90",
  questionCount: "20",
  passingScore: "60",
  gradingScale: "5_point",
  includeTheory: true,
  includePractice: true,
  includeTest: true,
  includeCases: false,
  evaluationCriteria: "",
  allowedMaterials: "",
};

export const useExamsSettingsStore = create<ExamsSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      setShowSettings: (show) => set({ showSettings: show }),
      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      resetSettings: () => set({ settings: defaultSettings}),
    }),
    {
      name: "exams-settings",
    }
  )
);