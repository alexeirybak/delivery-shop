import { Editor } from "@tiptap/react";
import { Node } from "prosemirror-model";

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

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
}