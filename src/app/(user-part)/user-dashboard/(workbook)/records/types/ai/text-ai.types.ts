export type AIStatus = "idle" | "loading" | "success" | "error";

export interface GPTResponse {
  text?: string;
  model?: string;
  error?: string;
  details?: string;
}

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

export interface AIMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  aiStatus: "idle" | "loading" | "success" | "error";
  selectedText: string;
  customPrompt: string;
  onCustomPromptChange: (value: string) => void;
  onQuickAction: (actionId: string, customPrompt?: string) => void; 
  onCustomPromptAction: (prompt: string) => void;
  onTestAPIAction: () => void;
  errorDetails: string;
}

export interface QuickActionsPanelProps {
  onActionClick: (actionId: string) => void;
  isGenerating: boolean;
}

export interface CustomPromptInputProps {
  prompt: string;
  onChange: (prompt: string) => void;
  disabled: boolean;
}

export interface FooterStatusProps {
  selectedText: string;
  aiStatus: AIStatus;
  errorDetails: string;
  onCancel: () => void;
  onSubmit: () => void;
  isGenerating: boolean;
  isSubmitDisabled: boolean;
}

export interface YandexGPTRequest {
  prompt: string;
  action?: string;
}

export interface GPTResponseAPI {
  result?: {
    alternatives?: Array<{
      message?: {
        text?: string;
      };
    }>;
  };
  error?: {
    message?: string;
  };
}

export interface ConnectionStatusProps {
  onTestAPI: () => void;
  isGenerating: boolean;
}
