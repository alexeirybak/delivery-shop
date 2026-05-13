import {
  FileData,
  GenerationMode,
  GenerationSettings,
  LoadedChat,
  Message,
  UploadedImage,
} from "../../../types";

export type EducationMode = Extract<
  GenerationMode,
  | "chat_education"
  | "syllabus"
  | "annotation"
  | "lecture"
  | "practice"
  | "laboratory"
  | "interactive"
  | "project"
  | "presentation"
  | "quiz"
  | "credit"
  | "exams"
  | "comparison"
  | "debate"
  | "homework_check"
>;

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
    customImages?: UploadedImage[],
    generationSettings?: GenerationSettings,
    customFile?: FileData | null,
    skipUserMessage?: boolean,
  ) => Promise<string>;
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
