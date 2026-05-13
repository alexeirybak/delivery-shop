import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NetworkSettings {
  maxNodes: number;
  maxEdges: number;
}

export interface NetworkSettingsStore {
  settings: NetworkSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof NetworkSettings>(
    key: K,
    value: NetworkSettings[K]
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: NetworkSettings = {
  maxNodes: 15,
  maxEdges: 20,
};

export const useNetworkSettingsStore = create<NetworkSettingsStore>()(
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
      name: "network-settings",
    },
  ),
);