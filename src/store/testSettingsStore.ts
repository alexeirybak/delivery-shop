import { TestSettings } from "@/app/(user-part)/user-dashboard/writing/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TestSettingsStore {
  settings: TestSettings;
  showSettings: boolean;
  isGenerationCompleted: boolean;
  updateSetting: <K extends keyof TestSettings>(
    key: K,
    value: TestSettings[K],
  ) => void;
  addChapter: (title: string) => void;
  removeChapter: (chapterId: string) => void;
  addSection: (chapterId: string, title: string) => void;
  removeSection: (chapterId: string, sectionId: string) => void;
  reorderChapters: (fromIndex: number, toIndex: number) => void;
  reorderSections: (
    chapterId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  resetSettings: () => void;
  setShowSettings: (show: boolean) => void;
  setGenerationCompleted: (completed: boolean) => void; 
  resetGenerationCompleted: () => void; 
}

const defaultSettings: TestSettings = {
  title: "",
  educationLevel: "school",
  grade: "5",
  courseYear: "1",
  subject: "",
  chapters: [],
  generationMode: "full",
};

export const useTestSettingsStore = create<TestSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      showSettings: false,
      isGenerationCompleted: false, 
      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      updateGenerationMode: (mode: "full" | "tasksOnly") =>
        set((state) => ({
          settings: { ...state.settings, generationMode: mode },
          isGenerationCompleted: false,
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

      setShowSettings: (show: boolean) => set({ showSettings: show }),

      setGenerationCompleted: (completed: boolean) =>
        set({ isGenerationCompleted: completed }),

      resetGenerationCompleted: () => set({ isGenerationCompleted: false }),
    }),
    {
      name: "test-generator-settings",
    },
  ),
);
