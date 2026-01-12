import { Editor } from "@tiptap/react";

export interface GenerationStatus {
  status: "idle" | "generating" | "processing" | "completed" | "failed";
  operationId?: string;
  imageUrl?: string;
  error?: string;
}

export interface ImageAIMenuModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  editor: Editor | null;
}

export interface PromptInputProps {
  prompt: string;
  onChange: (prompt: string) => void;
  disabled: boolean;
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

export interface SettingsPanelProps {
  selectedAspect: "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
  selectedStyle: "default" | "realistic" | "artistic" | "sketch" | "cartoon";
  onAspectChange: (aspect: "1:1" | "4:3" | "3:4" | "16:9" | "9:16") => void;
  onStyleChange: (
    style: "default" | "realistic" | "artistic" | "sketch" | "cartoon"
  ) => void;
  disabled: boolean;
}

export interface StatusPanelProps {
  status: "generating" | "processing";
  elapsedSeconds: number;
  operationId?: string;
}

export interface ResultPanelProps {
  imageUrl: string;
  prompt: string;
  selectedStyle: string;
  selectedAspect: string;
  elapsedSeconds: number;
  onDownload: () => void;
  onInsertToEditor: () => void;
  onOpenInNewTab: () => void;
}

export interface ErrorPanelProps {
  error: string;
}

export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

export type StyleType =
  | "default"
  | "realistic"
  | "artistic"
  | "sketch"
  | "cartoon";

export interface SettingsPanelProps {
  selectedAspect: AspectRatio;
  selectedStyle: StyleType;
  onAspectChange: (aspect: AspectRatio) => void;
  onStyleChange: (style: StyleType) => void;
  disabled: boolean;
}

export interface ImageRequest {
  prompt: string;
  aspect_ratio?: AspectRatio;
  style?: StyleType;
}
