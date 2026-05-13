import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProjectSettings {
  projectType: string;
  level: string;
  workFormat: string;
  duration: string;
  includeGoal: boolean;
  includePlan: boolean;
  includeLiterature: boolean;
  includeMethodology: boolean;
  includeResults: boolean;
  includePresentation: boolean;
  evaluationCriteria: string;
  maxScore: string;
  requirements: string;
  resources: string;
}

interface ProjectSettingsStore {
  settings: ProjectSettings;
  updateSetting: <K extends keyof ProjectSettings>(key: K, value: ProjectSettings[K]) => void;
  resetSettings: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: ProjectSettings = {
  projectType: "research",
  level: "intermediate",
  workFormat: "small_group",
  duration: "1_month",
  includeGoal: true,
  includePlan: true,
  includeLiterature: true,
  includeMethodology: true,
  includeResults: true,
  includePresentation: true,
  evaluationCriteria: "",
  maxScore: "100",
  requirements: "",
  resources: "",
};

export const useProjectSettingsStore = create<ProjectSettingsStore>()(
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
      name: "project-settings",
    }
  )
);