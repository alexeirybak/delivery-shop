export type AIStatus = "idle" | "loading" | "success" | "error";

export interface AIMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestAPIAction: () => void;
  onQuickAction: (actionId: string) => void;
  onCustomPromptAction: (prompt: string) => void;
  isGenerating: boolean;
  aiStatus: AIStatus;
  errorDetails: string;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  selectedText: string;
}

export interface ConnectionStatusProps {
  onTestAPI: () => void;
  isGenerating: boolean;
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

export interface YandexGPTResponse {
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