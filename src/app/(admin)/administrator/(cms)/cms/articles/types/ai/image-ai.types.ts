// Базовые типы
export type AspectRatio = "1:1" | "16:9" | "16:10" | "21:9";
export type StyleType =
  | "default"
  | "realistic"
  | "artistic"
  | "sketch"
  | "cartoon";

export type GenerationStatusType =
  | "idle"
  | "generating"
  | "loading"
  | "success"
  | "error";

export interface GenerationStatus {
  status: GenerationStatusType;
  operationId?: string;
  imageUrl?: string;
  error?: string;
}

// Главный интерфейс
export interface ImageAIModalProps {
  isOpen: boolean;
  prompt: string;
  generation: GenerationStatus;
  selectedAspect: AspectRatio;
  selectedStyle: StyleType;
  apiInfo: string;
  elapsedSeconds: number;
  // Обработчики событий
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAspectChange: (aspect: AspectRatio) => void;
  onStyleChange: (style: StyleType) => void;
  onTestAPI: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
  onInsertToEditor: (e: React.MouseEvent) => void;
  onGenerateImage: (e: React.MouseEvent) => void;
  // Дополнительные обработчики
  onModalClick?: (e: React.MouseEvent) => void;
  onCloseClick?: (e: React.MouseEvent) => void;
  onSettingsButtonClick?: (aspect: AspectRatio, e: React.MouseEvent) => void;
  onStyleButtonClick?: (style: StyleType, e: React.MouseEvent) => void;
}

export interface HeaderProps {
  onTestAPI: (e: React.MouseEvent) => void;
  onCloseClick?: (e: React.MouseEvent) => void;
  isGenerating: boolean;
}

export interface MainContentProps {
  apiInfo?: string;
  prompt: string;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  selectedAspect: AspectRatio;
  selectedStyle: StyleType;
  onAspectChange: (aspect: AspectRatio) => void;
  onStyleChange: (style: StyleType) => void;
  isGenerating: boolean;
  onAspectButtonClick?: (aspect: AspectRatio, e: React.MouseEvent) => void;
  onStyleButtonClick?: (style: StyleType, e: React.MouseEvent) => void;
  generation: GenerationStatus;
  elapsedSeconds: number;
  onDownload: (e: React.MouseEvent) => void;
  onInsertToEditor: (e: React.MouseEvent) => void;
}

export interface FooterProps {
  generationStatus: string;
  elapsedSeconds: number;
  prompt: string;
  onCloseClick?: (e: React.MouseEvent) => void; 
  onInsertToEditor: (e: React.MouseEvent) => void;
  onGenerateImage: (e: React.MouseEvent) => void; 
}

// Для вложенных компонентов
export interface PromptSectionProps {
  prompt: string;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isGenerating: boolean;
}

export interface ApiInfoAlertProps {
  apiInfo?: string;
}

export interface ErrorPanelProps {
  error: string;
}

export interface SettingsPanelProps {
  selectedAspect: AspectRatio;
  selectedStyle: StyleType;
  onAspectChange: (aspect: AspectRatio) => void;
  onStyleChange: (style: StyleType) => void;
  isGenerating: boolean;
  onAspectButtonClick?: (aspect: AspectRatio, e: React.MouseEvent) => void;
  onStyleButtonClick?: (style: StyleType, e: React.MouseEvent) => void;
}

export interface StatusPanelProps {
  status: "generating" | "loading" | "idle" | "success" | "error";
  elapsedSeconds: number;
  operationId?: string;
}

export interface ResultPanelProps {
  imageUrl: string;
  prompt: string;
  selectedStyle: StyleType;
  selectedAspect: AspectRatio;
  elapsedSeconds: number;
  onDownload: (e: React.MouseEvent) => void;
  onInsertToEditor: (e: React.MouseEvent) => void;
}

export interface AspectRatioOption {
  id: AspectRatio;
  label: string;
  icon: string;
  desc: string;
}

export interface StyleOption {
  id: StyleType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export interface GenerationRequest {
  prompt: string;
  aspect_ratio?: AspectRatio;
  style?: StyleType;
}

export interface YandexArtGenerationRequest {
  modelUri: string;
  messages: Array<{ text: string; weight: number }>;
  generationOptions: {
    mimeType: "image/png";
    seed: number;
    aspectRatio?: {
      widthRatio: number;
      heightRatio: number;
    };
  };
}

export interface YandexArtResponse {
  id?: string;
  operationId?: string;
}

export interface OperationStatus {
  done: boolean;
  response?: {
    image: string;
  };
  error?: string;
  createdAt?: string;
  modifiedAt?: string;
}

export interface ApiResponse {
  message: string | undefined;
  success: boolean;
  operationId?: string;
  details?: string;
  error?: string;
  model?: string;
  done?: boolean;
  imageUrl?: string;
}