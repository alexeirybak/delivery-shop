import { Editor } from "@tiptap/react";
import { Node } from "prosemirror-model";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { CONFIG_TOOLBAR_COMPONENTS } from "../../utils/CONFIG_TOOLBAR";

export interface TiptapEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export interface EditorProps {
  editor: Editor | null;
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

export interface HtmlEditorModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onCloseAction: () => void;
}

export interface NodeInfo {
  node: Node;
  pos: number;
  type: string;
}

export interface UseImageUploadReturn {
  isUploading: boolean;
  uploadFile: (file: File) => Promise<void>;
  insertByUrl: () => void;
  validateImageFile: (file: File) => string | null;
}

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
}

export interface ImageMenuProps extends EditorProps {
  onDragOverChange?: (isDragging: boolean) => void;
}

export interface MainToolbarProps extends EditorProps {
  onImageDragOverChange?: (isDragging: boolean) => void;
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
  node: ProseMirrorNode;
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

export interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ToolbarGroup = {
  id: string;
  name: string;
  items: string[];
};

export type ToolbarComponentId = keyof typeof CONFIG_TOOLBAR_COMPONENTS;
