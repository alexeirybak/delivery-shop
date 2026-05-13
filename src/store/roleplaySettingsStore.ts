import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RoleplaySettings {
  difficulty: "beginner" | "intermediate" | "expert";
  includeMetrics: boolean;
  includeHistory: boolean;
  maxChoices: number;
  showConsequences: boolean;
}

interface RoleplaySettingsStore {
  settings: RoleplaySettings;
  showSettings: boolean;
  updateSetting: <K extends keyof RoleplaySettings>(
    key: K,
    value: RoleplaySettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: RoleplaySettings = {
  difficulty: "intermediate",
  includeMetrics: true,
  includeHistory: true,
  maxChoices: 4,
  showConsequences: true,
};

export const useRoleplaySettingsStore = create<RoleplaySettingsStore>()(
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
      name: "roleplay-settings",
    },
  ),
);
