import { EducationLevel, WritingChapter } from "@/app/(user-part)/user-dashboard/writing/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface WritingSettings {
  title: string;
  educationLevel: EducationLevel;
  grade?: string;
  courseYear?: string;
  subject: string;
  chapters: WritingChapter[];
}

interface WritingSettingsStore {
  settings: WritingSettings;
  showSettings: boolean;
  isGenerationCompleted: boolean;
  updateSetting: <K extends keyof WritingSettings>(
    key: K,
    value: WritingSettings[K],
  ) => void;
  addChapter: (title: string) => void;
  removeChapter: (chapterId: string) => void;
  addSection: (chapterId: string, title: string) => void;
  removeSection: (chapterId: string, sectionId: string) => void;
  updateSectionContent: (
    chapterId: string,
    sectionId: string,
    content: string,
  ) => void;
  reorderChapters: (fromIndex: number, toIndex: number) => void;
  reorderSections: (
    chapterId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  resetSettings: () => void;
  setGenerationCompleted: (completed: boolean) => void;
  resetGenerationCompleted: () => void;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: WritingSettings = {
  title: "",
  educationLevel: "school",
  grade: "5",
  courseYear: "1",
  subject: "",
  chapters: [],
};

export const useWritingSettingsStore = create<WritingSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      isGenerationCompleted: false,

      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),

      addChapter: (title: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            chapters: [
              ...state.settings.chapters,
              { id: crypto.randomUUID(), title, sections: [] },
            ],
          },
          isGenerationCompleted: false,
        })),

      removeChapter: (chapterId: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            chapters: state.settings.chapters.filter(
              (ch) => ch.id !== chapterId,
            ),
          },
          isGenerationCompleted: false,
        })),

      addSection: (chapterId: string, title: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            chapters: state.settings.chapters.map((ch) =>
              ch.id === chapterId
                ? {
                    ...ch,
                    sections: [
                      ...ch.sections,
                      { id: crypto.randomUUID(), title },
                    ],
                  }
                : ch,
            ),
          },
          isGenerationCompleted: false,
        })),

      removeSection: (chapterId: string, sectionId: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            chapters: state.settings.chapters.map((ch) =>
              ch.id === chapterId
                ? {
                    ...ch,
                    sections: ch.sections.filter((s) => s.id !== sectionId),
                  }
                : ch,
            ),
          },
          isGenerationCompleted: false,
        })),

      updateSectionContent: (
        chapterId: string,
        sectionId: string,
        content: string,
      ) =>
        set((state) => ({
          settings: {
            ...state.settings,
            chapters: state.settings.chapters.map((ch) =>
              ch.id === chapterId
                ? {
                    ...ch,
                    sections: ch.sections.map((s) =>
                      s.id === sectionId ? { ...s, content } : s,
                    ),
                  }
                : ch,
            ),
          },
        })),

      reorderChapters: (fromIndex: number, toIndex: number) =>
        set((state) => {
          const newChapters = [...state.settings.chapters];
          const [moved] = newChapters.splice(fromIndex, 1);
          newChapters.splice(toIndex, 0, moved);
          return {
            settings: { ...state.settings, chapters: newChapters },
            isGenerationCompleted: false,
          };
        }),

      reorderSections: (
        chapterId: string,
        fromIndex: number,
        toIndex: number,
      ) =>
        set((state) => ({
          settings: {
            ...state.settings,
            chapters: state.settings.chapters.map((ch) =>
              ch.id === chapterId
                ? {
                    ...ch,
                    sections: (() => {
                      const newSections = [...ch.sections];
                      const [moved] = newSections.splice(fromIndex, 1);
                      newSections.splice(toIndex, 0, moved);
                      return newSections;
                    })(),
                  }
                : ch,
            ),
          },
          isGenerationCompleted: false,
        })),

      resetSettings: () =>
        set({
          settings: defaultSettings,
          isGenerationCompleted: false,
        }),

      setGenerationCompleted: (completed: boolean) =>
        set({ isGenerationCompleted: completed }),
      resetGenerationCompleted: () => set({ isGenerationCompleted: false }),
      setShowSettings: (show: boolean) => set({ showSettings: show }),
    }),
    {
      name: "writing-settings", // Один store для всех
    },
  ),
);
