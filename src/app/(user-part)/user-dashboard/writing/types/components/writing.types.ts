import {
  GenerationMode,
  GenerationSettings,
  LoadedChat,
  Message,
  UploadedImage,
} from "../../../types";

export type EducationLevel = "school" | "spo" | "university";

export interface WritingSection {
  id: string;
  title: string;
  content?: string;
}

export interface WritingChapter {
  id: string;
  title: string;
  sections: WritingSection[];
}

export type WritingWorkMode = "textbooks" | "coursework" | "report" | "thesis";

export interface TestSection {
  id: string;
  title: string;
  content?: string;
}

export interface TestChapter {
  id: string;
  title: string;
  sections: TestSection[];
}

export interface TestSettings {
  title: string;
  educationLevel: EducationLevel;
  grade?: string;
  courseYear?: string;
  subject: string;
  chapters: TestChapter[];
  generationMode: "full" | "tasksOnly";
}

export interface UseChatHistoryReturn {
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveChatToDatabase: (
    msgs: Message[],
    mode: GenerationMode,
    chatId: string | null,
  ) => Promise<string | null>;
  loadChatFromDatabase: (chatId: string) => Promise<LoadedChat | null>;
  deleteChat: (chatId: string, currentId: string | null) => Promise<boolean>;
  createNewChat: () => void;
}

export interface UseSendMessageParams {
  mode: GenerationMode;
  messages: Message[];
  isGenerating: boolean;
  setShowLoader: (show: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addUserMessage: (content: string, images?: UploadedImage[]) => Message;
  addStreamingMessage: () => string;
  updateStreamingContent: (id: string, content: string) => void;
  finalizeStreamingMessage: (id: string, content: string) => Message;
  setErrorMessage: (id: string, error: string) => void;
  saveChatToDatabase: (
    msgs: Message[],
    mode: GenerationMode,
    chatId: string | null,
  ) => Promise<string | null>;
  currentChatId: string | null;
  abortControllerRef: React.RefObject<AbortController | null>;
}

export interface UseSendMessageReturn {
  sendMessage: (
    customInput?: string,
    generationSettings?: GenerationSettings,
    forceChatId?: string | null,
    skipUserMessage?: boolean,
    skipDatabaseSave?: boolean, 
  ) => Promise<{ content: string; chatId: string | null }>;
}
