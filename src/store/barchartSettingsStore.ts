import { create } from "zustand";

export interface BarchartSettings {
  maxBars: number;
  sortOrder: "none" | "asc" | "desc";
}

export interface BarchartSettingsStore {
  settings: BarchartSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof BarchartSettings>(
    key: K,
    value: BarchartSettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: BarchartSettings = {
  maxBars: 10,
  sortOrder: "none",
};

export const useBarchartSettingsStore = create<BarchartSettingsStore>(
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
);