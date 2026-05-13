import { LucideIcon } from "lucide-react";
import { FileData, UploadedImage } from "./upload.types";
import { Message } from "./chat.types";
import { GenerationMode } from "./generation.types";

export interface FileUploadButtonProps {
  onFileChange: (file: FileData | null) => void;
  disabled?: boolean;
}

export interface ImageUploadButtonProps {
  images: UploadedImage[];  
  onImagesChange: (images: UploadedImage[]) => void;  
  disabled?: boolean;
}

export interface ImagePreviewProps {
  images: UploadedImage[];  
  onRemove: (index: number) => void;
}

export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isGenerating: boolean;
  onSend: () => void;
  onStop: () => void;
  placeholder: string;
  disabled?: boolean;
  onNewChat: () => void;
  messages: Message[];
  extraButtons?: React.ReactNode;
  showImageUpload?: boolean;
  images?: UploadedImage[];
  onImagesChange?: (images: UploadedImage[]) => void;
  model?: "deepseek" | "qwen";
  onModelChange?: (model: "deepseek" | "qwen") => void;
  file?: FileData | null;
  onFileChange?: (file: FileData | null) => void;
  isDictationMode?: boolean;
  onDictationReady?: (text: string) => void;
  isTranscriptionMode?: boolean;
  onTranscriptionComplete?: (text: string) => void;
}

export interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  refreshTrigger?: number;
}

export interface LoadChatButtonProps {
  onLoadChat: (messages: [], mode: string) => void;
}

export interface ChatHeaderProps {
  onNewChat: () => void;
  onToggleSidebar: () => void;
}

export interface DownloadButtonsPanelProps {
  hasAssistantMessages: boolean;
  hasAnyMessages: boolean;
  downloading:
    | "full"
    | "last"
    | "presentation"
    | "last-pdf"
    | "full-pdf"
    | null;
  onDownloadLast: () => void;
  onDownloadLastPdf: () => void;
  onDownloadFull: () => void;
  onDownloadFullPdf: () => void;
  onDownloadPresentation: () => void;
  lastMessageMode?: string;
}

export interface EmptyStateProps {
  modeLabel?: string;
  modeDescription?: string;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface MessageListProps {
  messages: Message[];
  copiedId: string | null;
  onCopy: (content: string, id: string) => void;
  onRetry?: () => void;
  mode?: string;
}

export interface SendButtonProps {
  isGenerating: boolean;
  onSend: () => void;
  onStop: () => void;
  disabled?: boolean;
  hasContent: boolean;
}

export interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
}

export interface ModeSelectorProps {
  currentMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}