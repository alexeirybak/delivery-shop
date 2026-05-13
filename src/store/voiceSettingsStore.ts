import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PsychologicalSettings {
  voiceId: string;
  voiceName: string;
  voiceGender: "male" | "female";
}

export type VoiceId =
  | "alena"
  | "jane"
  | "omazh"
  | "julia"
  | "filipp"
  | "ermil"
  | "madirus"
  | "zahar";

export interface VoiceInfo {
  id: VoiceId;
  name: string;
  gender: "male" | "female";
}

export const VOICES: VoiceInfo[] = [
  { id: "alena", name: "Алёна", gender: "female" },
  { id: "jane", name: "Жанна", gender: "female" },
  { id: "omazh", name: "Омаж", gender: "female" },
  { id: "julia", name: "Юлия", gender: "female" },
  { id: "filipp", name: "Филипп", gender: "male" },
  { id: "ermil", name: "Ермил", gender: "male" },
  { id: "madirus", name: "Мадирус", gender: "male" },
  { id: "zahar", name: "Захар", gender: "male" },
];

export interface VoiceSettings {
  voiceId: VoiceId;
  voiceName: string;
  voiceGender: "male" | "female";
}

interface VoiceSettingsStore {
  settings: VoiceSettings;
  showSettings: boolean;  
  setVoice: (voiceId: VoiceId) => void;
  setShowSettings: (show: boolean) => void;
  resetSettings: () => void;
}

export const useVoiceSettingsStore = create<VoiceSettingsStore>()(
  persist(
    (set) => ({
      settings: {
        voiceId: "ermil",
        voiceName: "Ермил",
        voiceGender: "male",
      },
      showSettings: false,  
      setVoice: (voiceId) => {
        const voice = VOICES.find(v => v.id === voiceId);
        if (voice) {
          set((state) => ({
            settings: {
              ...state.settings,
              voiceId: voice.id,
              voiceName: voice.name,
              voiceGender: voice.gender,
            },
          }));
        }
      },
      setShowSettings: (show) => set({ showSettings: show }),  // ← прямое обновление
      resetSettings: () => set({
        settings: {
          voiceId: "ermil",
          voiceName: "Ермил",
          voiceGender: "male",
        },
      }),
    }),
    { name: "voice-settings" }
  )
);