"use client";

import { useState } from "react";
import { Quote, Code, FileCode } from "lucide-react";
import { Editor } from "@tiptap/react";
import { HtmlEditorModal } from "./HtmlEditorModal";

interface BlockMenuProps {
  editor: Editor | null;
}

export const BlockMenu = ({ editor }: BlockMenuProps) => {
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);

  if (!editor) return null;

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
            editor.isActive("blockquote") 
              ? "bg-gray-300 text-blue-600" 
              : "text-gray-600"
        }`}
          title="Цитата"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
            editor.isActive("code") 
              ? "bg-gray-300 text-blue-600" 
              : "text-gray-600"
          }`}
          title="Inline код"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsHtmlModalOpen(true)}
          className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600"
          title="Редактор HTML"
        >
          <FileCode className="w-4 h-4" />
        </button>
      </div>

      <HtmlEditorModal
        editor={editor}
        isOpen={isHtmlModalOpen}
        onCloseAction={() => setIsHtmlModalOpen(false)}
      />
    </>
  );
};