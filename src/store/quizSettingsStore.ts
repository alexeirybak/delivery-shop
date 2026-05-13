import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuizSettings {
  subject: string;
  educationLevel: string;
  questionCount: string;
  difficulty: string;
  optionsCount: string;
  includeMultipleChoice: boolean;
  includeTrueFalse: boolean;
  includeOpenEnded: boolean;
  includeMatching: boolean;
  competence: string;
  passingScore: string;
  includeExplanation: boolean;
  randomizeOrder: boolean;
}

interface QuizSettingsStore {
  settings: QuizSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof QuizSettings>(
    key: K,
    value: QuizSettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: QuizSettings = {
  subject: "",
  educationLevel: "бакалавриат",
  questionCount: "10",
  difficulty: "средний",
  optionsCount: "4",
  includeMultipleChoice: true,
  includeTrueFalse: false,
  includeOpenEnded: false,
  includeMatching: false,
  competence: "",
  passingScore: "70",
  includeExplanation: true,
  randomizeOrder: false,
};

export const useQuizSettingsStore = create<QuizSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      resetSettings: () =>
        set({
          settings: defaultSettings,
        }),
      setShowSettings: (show) => set({ showSettings: show }),
    }),
    {
      name: "quiz-settings-storage",
    },
  ),
);