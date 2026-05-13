import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MindmapSettings {
  depth: string;
  nodeCount: string;
}

interface MindmapSettingsStore {
  settings: MindmapSettings;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  updateSetting: <K extends keyof MindmapSettings>(key: K, value: MindmapSettings[K]) => void;
  resetSettings: () => void;
}

const defaultSettings: MindmapSettings = {
  depth: "3",
  nodeCount: "15",
};

export const useMindmapSettingsStore = create<MindmapSettingsStore>()(
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
      name: "mindmap-settings",
    }
  )
);