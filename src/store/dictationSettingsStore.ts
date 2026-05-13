import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DictationLanguage =
  | "ru-RU"
  | "en-US"
  | "kk-KZ"
  | "uz-UZ"
  | "de-DE"
  | "fr-FR"
  | "es-ES"
  | "it-IT"
  | "tr-TR"
  | "zh-CN"
  | "ja-JP"
  | "ko-KR";

export const LANGUAGES: {
  code: DictationLanguage;
  name: string;
  flag: string;
}[] = [
  { code: "ru-RU", name: "Русский", flag: "🇷🇺" },
  { code: "en-US", name: "English", flag: "🇺🇸" },
  { code: "kk-KZ", name: "Қазақша", flag: "🇰🇿" },
  { code: "uz-UZ", name: "O‘zbekcha", flag: "🇺🇿" },
  { code: "de-DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr-FR", name: "Français", flag: "🇫🇷" },
  { code: "es-ES", name: "Español", flag: "🇪🇸" },
  { code: "it-IT", name: "Italiano", flag: "🇮🇹" },
  { code: "tr-TR", name: "Türkçe", flag: "🇹🇷" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
  { code: "ko-KR", name: "한국어", flag: "🇰🇷" },
];

export interface DictationSettings {
  language: DictationLanguage;
}

interface DictationSettingsStore {
  settings: DictationSettings;
  showSettings: boolean;
  updateLanguage: (language: DictationLanguage) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: DictationSettings = {
  language: "ru-RU",
};

export const useDictationSettingsStore = create<DictationSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      updateLanguage: (language) => set({ settings: { language } }),
      resetSettings: () => set({ settings: defaultSettings }),
      setShowSettings: (show) => set({ showSettings: show }),
    }),
    { name: "dictation-settings" },
  ),
);
