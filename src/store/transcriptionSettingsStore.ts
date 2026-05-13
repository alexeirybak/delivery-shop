import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TranscriptionLanguage =
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

export const TRANSCRIPTION_LANGUAGES: {
  code: TranscriptionLanguage;
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

export interface TranscriptionSettings {
  language: TranscriptionLanguage;
}

interface TranscriptionSettingsStore {
  settings: TranscriptionSettings;
  showSettings: boolean;
  updateLanguage: (language: TranscriptionLanguage) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: TranscriptionSettings = {
  language: "ru-RU",
};

export const useTranscriptionSettingsStore =
  create<TranscriptionSettingsStore>()(
    persist(
      (set) => ({
        settings: defaultSettings,
        showSettings: false,
        updateLanguage: (language) =>
          set((state) => ({
            settings: { ...state.settings, language },
          })),
        resetSettings: () => set({ settings: defaultSettings }),
        setShowSettings: (show) => set({ showSettings: show }),
      }),
      { name: "transcription-settings" },
    ),
  );
