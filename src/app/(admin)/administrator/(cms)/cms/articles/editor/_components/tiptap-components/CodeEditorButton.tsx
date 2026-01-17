"use client";

import { useState } from "react";
import { FileCode } from "lucide-react";
import { HtmlEditorModal } from "./HtmlEditorModal";
import { EditorProps } from "../../../types";

export const CodeEditorButton = ({ editor }: EditorProps) => {
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);

  if (!editor) return null;

  return (
    <>
      <div className="flex items-center gap-1">
       
        <button
          type="button"
          onClick={() => setIsHtmlModalOpen(true)}
          className="p-2 rounded duration-300 cursor-pointer text-gray-700 hover:bg-gray-100"
          title="Редактор HTML (Ctrl+Shift+H)"
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