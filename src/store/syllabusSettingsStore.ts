import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SyllabusSettings {
  direction: string;
  directionCode: string;
  educationLevel: string;
  profile: string;
  studyForm: string;
  courseName: string;
  courseYear: string;
  lectureHours: string;
  practiceHours: string;
  labHours: string;
  selfStudyHours: string;
  totalHours: string;
  credits: string;
  courseType: string;
  difficulty: string;
  assessmentForm: string;
  preferredMethods: string;
  preferredAssessment: string;
  availableSoftware: string;
  availableEquipment: string;
  studentFeatures: string;
  limitations: string;
}

interface SyllabusSettingsStore {
  settings: SyllabusSettings;
  showSettings: boolean;
  updateSetting: <K extends keyof SyllabusSettings>(
    key: K,
    value: SyllabusSettings[K],
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: SyllabusSettings = {
  direction: "",
  directionCode: "",
  educationLevel: "бакалавриат",
  profile: "",
  studyForm: "очная",
  courseName: "",
  courseYear: "3",
  lectureHours: "18",
  practiceHours: "22",
  labHours: "0",
  selfStudyHours: "16",
  totalHours: "108",
  credits: "3",
  courseType: "смешанный",
  difficulty: "средний",
  assessmentForm: "экзамен",
  preferredMethods: "",
  preferredAssessment: "",
  availableSoftware: "",
  availableEquipment: "",
  studentFeatures: "",
  limitations: "",
};

export const useSyllabusSettingsStore = create<SyllabusSettingsStore>()(
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
      name: "syllabus-settings-storage",
    },
  ),
);