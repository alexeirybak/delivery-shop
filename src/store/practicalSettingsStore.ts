import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PracticalSettings {
  targetAudience: string;
  level: string;
  duration: string;
  practicalType: string;
  workFormat: string;
  groupSize: string;
  includeGoal: boolean;
  includePlan: boolean;
  includeTheoretical: boolean;
  includeTasks: boolean;
  includeDiscussion: boolean;
  includeSummary: boolean;
  includeReferences: boolean;
  includeAssessment: boolean;
  assessmentCriteria: string;
  style: string;
  additionalNotes: string;
}

interface PracticalSettingsStore {
  settings: PracticalSettings;
  updateSetting: <K extends keyof PracticalSettings>(key: K, value: PracticalSettings[K]) => void;
  resetSettings: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: PracticalSettings = {
  targetAudience: "students_bachelor",
  level: "intermediate",
  duration: "90",
  practicalType: "seminar",
  workFormat: "mixed",
  groupSize: "",
  includeGoal: true,
  includePlan: true,
  includeTheoretical: true,
  includeTasks: true,
  includeDiscussion: true,
  includeSummary: true,
  includeReferences: true,
  includeAssessment: false,
  assessmentCriteria: "",
  style: "interactive",
  additionalNotes: "",
};

export const usePracticalSettingsStore = create<PracticalSettingsStore>()(
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
      name: "practical-settings",
    }
  )
);