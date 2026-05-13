import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LaboratorySettings {
  targetAudience: string;
  level: string;
  duration: string;
  requiredEquipment: string;
  consumables: string;
  software: string;
  includeGoal: boolean;
  includeTheory: boolean;
  includeProcedure: boolean;
  includeObservations: boolean;
  includeQuestions: boolean;
  includeReport: boolean;
  includeSafetyRules: boolean;
  customSafetyRules: string;
  includeAssessment: boolean;
  assessmentCriteria: string;
}

interface LaboratorySettingsStore {
  settings: LaboratorySettings;
  updateSetting: <K extends keyof LaboratorySettings>(key: K, value: LaboratorySettings[K]) => void;
  resetSettings: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: LaboratorySettings = {
  targetAudience: "students_bachelor",
  level: "intermediate",
  duration: "90",
  requiredEquipment: "",
  consumables: "",
  software: "",
  includeGoal: true,
  includeTheory: true,
  includeProcedure: true,
  includeObservations: true,
  includeQuestions: true,
  includeReport: true,
  includeSafetyRules: true,
  customSafetyRules: "",
  includeAssessment: false,
  assessmentCriteria: "",
};

export const useLaboratorySettingsStore = create<LaboratorySettingsStore>()(
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
      name: "laboratory-settings",
    }
  )
);