import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InteractiveSettings {
  targetAudience: string;
  level: string;
  participantCount: string;
  duration: string;
  interactiveType: string;
  engagementMethods: string;
  includeWarmup: boolean;
  includePoll: boolean;
  includeGroupWork: boolean;
  includeQuiz: boolean;
  includeDiscussion: boolean;
  includeReflection: boolean;
  includePoints: boolean;
  includeBadges: boolean;
  includeLeaderboard: boolean;
  includeFeedback: boolean;
}

interface InteractiveSettingsStore {
  settings: InteractiveSettings;
  updateSetting: <K extends keyof InteractiveSettings>(key: K, value: InteractiveSettings[K]) => void;
  resetSettings: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: InteractiveSettings = {
  targetAudience: "students_bachelor",
  level: "intermediate",
  participantCount: "20",
  duration: "60",
  interactiveType: "quiz",
  engagementMethods: "",
  includeWarmup: true,
  includePoll: true,
  includeGroupWork: true,
  includeQuiz: true,
  includeDiscussion: true,
  includeReflection: true,
  includePoints: true,
  includeBadges: false,
  includeLeaderboard: false,
  includeFeedback: true,
};

export const useInteractiveSettingsStore = create<InteractiveSettingsStore>()(
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
      name: "interactive-settings",
    }
  )
);