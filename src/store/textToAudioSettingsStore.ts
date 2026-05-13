import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TextToAudioVoiceId =
  // Русские голоса (v1)
  | "alena"
  | "filipp"
  | "ermil"
  | "jane"
  | "omazh"
  | "zahar"
  | "marina"
  // Немецкий
  | "lea"
  // Английский
  | "john"
  // Казахский
  | "amira"
  | "madi"
  // Узбекский
  | "nigora";

export type TextToAudioLanguage =
  | "ru-RU"
  | "en-US"
  | "de-DE"
  | "kk-KK"
  | "uz-UZ";

export interface TextToAudioVoiceInfo {
  id: TextToAudioVoiceId;
  name: string;
  gender: "male" | "female";
  language: TextToAudioLanguage;
  description: string;
}

export const TEXT_TO_AUDIO_VOICES: TextToAudioVoiceInfo[] = [
  // Русские голоса (v1)
  {
    id: "alena",
    name: "Алёна",
    gender: "female",
    language: "ru-RU",
    description: "Мягкий, тёплый",
  },
  {
    id: "ermil",
    name: "Ермил",
    gender: "male",
    language: "ru-RU",
    description: "Спокойный",
  },
  {
    id: "filipp",
    name: "Филипп",
    gender: "male",
    language: "ru-RU",
    description: "Уверенный",
  },
  {
    id: "zahar",
    name: "Захар",
    gender: "male",
    language: "ru-RU",
    description: "Бодрый",
  },
  {
    id: "jane",
    name: "Жанна",
    gender: "female",
    language: "ru-RU",
    description: "Эмоциональный",
  },
  {
    id: "omazh",
    name: "Омаж",
    gender: "female",
    language: "ru-RU",
    description: "Загадочный",
  },
  {
    id: "marina",
    name: "Марина",
    gender: "female",
    language: "ru-RU",
    description: "Спокойный, может шептать",
  },

  // Немецкий (v1)
  {
    id: "lea",
    name: "Lea",
    gender: "female",
    language: "de-DE",
    description: "Немецкий голос",
  },

  // Английский (v1)
  {
    id: "john",
    name: "John",
    gender: "male",
    language: "en-US",
    description: "Английский голос",
  },

  // Казахский (v1)
  {
    id: "amira",
    name: "Amira",
    gender: "female",
    language: "kk-KK",
    description: "Казахский голос",
  },
  {
    id: "madi",
    name: "Madi",
    gender: "male",
    language: "kk-KK",
    description: "Казахский голос",
  },

  // Узбекский (v1)
  {
    id: "nigora",
    name: "Nigora",
    gender: "female",
    language: "uz-UZ",
    description: "Узбекский голос",
  },
];

export interface TextToAudioSettings {
  voiceId: TextToAudioVoiceId;
  voiceName: string;
  voiceGender: "male" | "female";
  language: TextToAudioLanguage;
  speed: number;
  showSettings: boolean;
}

interface TextToAudioSettingsStore {
  settings: TextToAudioSettings;
  setVoice: (voiceId: TextToAudioVoiceId) => void;
  setLanguage: (language: TextToAudioLanguage) => void;
  setSpeed: (speed: number) => void;
  setShowSettings: (show: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings: TextToAudioSettings = {
  voiceId: "ermil",
  voiceName: "Ермил",
  voiceGender: "male",
  language: "ru-RU",
  speed: 1,
  showSettings: false,
};

export const useTextToAudioSettingsStore = create<TextToAudioSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setVoice: (voiceId) => {
        const voice = TEXT_TO_AUDIO_VOICES.find((v) => v.id === voiceId);
        if (voice) {
          set((state) => ({
            settings: {
              ...state.settings,
              voiceId: voice.id,
              voiceName: voice.name,
              voiceGender: voice.gender,
              language: voice.language,
            },
          }));
        }
      },
      setLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),
      setSpeed: (speed) =>
        set((state) => ({
          settings: { ...state.settings, speed },
        })),
      setShowSettings: (show) =>
        set((state) => ({
          settings: { ...state.settings, showSettings: show },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    { name: "text-to-audio-settings" },
  ),
);
