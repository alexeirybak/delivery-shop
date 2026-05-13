import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FlowchartSettings {
  maxNodes: number;
}

export interface FlowchartSettingsStore {
  settings: FlowchartSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof FlowchartSettings>(
    key: K,
    value: FlowchartSettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: FlowchartSettings = {
  maxNodes: 10,
};

export const useFlowchartSettingsStore = create<FlowchartSettingsStore>()(
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
      name: "flowchart-settings",
    },
  ),
);
