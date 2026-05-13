import { Editor } from "@tiptap/react";
import { Node } from "prosemirror-model";

export interface TiptapEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  categoryName: string;
  recordName: string;
}

export interface EditorProps {
  editor: Editor | null;
}

export interface NodeInfo {
  node: Node;
  pos: number;
  type: string;
}

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
}

export interface MainToolbarProps {
  editor: Editor;
  onImageDragOverChange?: (isDragging: boolean) => void;
}

export interface CounterProps {
  wordCount: number;
  charCount: number;
}

export interface HtmlEditorModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onCloseAction: () => void;
}

export interface ImageAttributes {
  src: string;
  alt: string;
  title: string;
  width?: string;
  height?: string;
  align?: "left" | "right" | "center" | "none";
  style?: string;
}

export interface SelectedImage {
  node: Node; 
  pos: number;
  attrs: ImageAttributes;
}

export interface ImageAttributesState {
  src: string;
  alt: string;
  title: string;
  width?: string;
  height?: string;
  align?: "left" | "right" | "center" | "none";
  style?: string;
}

export interface ImageAttributesModalContentProps {
  currentImage: ImageAttributes | null;
  attributes: {
    alt: string;
    title: string;
    width: string;
    height: string;
    align: "left" | "right" | "center" | "none";
  };
  setAttributes: React.Dispatch<
    React.SetStateAction<{
      alt: string;
      title: string;
      width: string;
      height: string;
      align: "left" | "right" | "center" | "none";
    }>
  >;
  activeTab: "basic" | "advanced";
  setActiveTab: (tab: "basic" | "advanced") => void;
  setPresetSize: (preset: "small" | "medium" | "large" | "original") => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

export interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  initialUrl?: string;
  initialText?: string;
  initialOpenInNewTab?: boolean;
  isEditing?: boolean;
}
