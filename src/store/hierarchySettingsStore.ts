import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HierarchySettings {
  maxDepth: number;
  maxNodes: number;
  showRoot: boolean;
  topic?: string;
}

export interface HierarchySettingsStore {
  settings: HierarchySettings;
  showSettings: boolean;
  updateSetting: <K extends keyof HierarchySettings>(
    key: K,
    value: HierarchySettings[K]
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: HierarchySettings = {
  maxDepth: 3,
  maxNodes: 30,
  showRoot: true,
};

export const useHierarchySettingsStore = create<HierarchySettingsStore>()(
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
      name: "hierarchy-settings",
    }
  )
);