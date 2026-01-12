import { Editor } from "@tiptap/react";

export interface TiptapEditorProps {
  content: string;
  onContentChangeAction: (content: string) => void;
}

export interface TipTapMenuProps {
  editor: Editor | null;
}

export interface ApiResponse {
  text?: string;
  error?: string;
  details?: string;
  provider?: string;
  model?: string;
}