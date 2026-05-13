import { ArticleSettings } from "@/store/scientificArticleSettingsStore";
import { GenerationMode, LoadedChat, Message } from "../../../types";
import { AIModel } from "../models/model.types";

export type ArticleStatus =
  | "idle"
  | "structure_generated"
  | "writing"
  | "completed";

export interface UseSendMessageParams {
  mode: GenerationMode;
  messages: Message[];
  isGenerating: boolean;
  setShowLoader: (show: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addUserMessage: (content: string) => Message;
  addStreamingMessage: () => string;
  updateStreamingContent: (id: string, content: string) => void;
  finalizeStreamingMessage: (id: string, content: string) => Message;
  setErrorMessage: (id: string, error: string) => void;
  saveChatToDatabase: (
    messages: Message[],
    mode: GenerationMode,
    chatId: string | null,  
    articleStatus?: ArticleStatus,
  ) => Promise<string | null>;
  currentChatId: string | null;
  abortControllerRef: React.RefObject<AbortController | null>;
  model?: "deepseek" | "qwen";
}

export interface UseSendMessageReturn {
  sendMessage: (
    customInput: string,
    metaType?: "structure" | "article_part",
    isFullArticle?: boolean,
    mode?: GenerationMode,
    settings?: Partial<ArticleSettings>,
    skipAddUserMessage?: boolean,
    model?: AIModel,
  ) => Promise<void>;
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
    articleStatus?: ArticleStatus,
  ) => Promise<string | null>;
  loadChatFromDatabase: (chatId: string) => Promise<LoadedChat | null>;
  deleteChat: (chatId: string, currentId: string | null) => Promise<boolean>;
  createNewChat: () => void;
}
