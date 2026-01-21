import { Node } from "prosemirror-model";

import { Editor } from "@tiptap/react";

export interface TiptapEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export interface EditorProps {
  editor: Editor | null;
}

export interface ApiResponse {
  text?: string;
  error?: string;
  details?: string;
  provider?: string;
  model?: string;
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