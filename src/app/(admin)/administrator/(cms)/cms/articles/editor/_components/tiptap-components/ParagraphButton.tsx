import { Type } from "lucide-react";
import { EditorProps } from "../../../types";

export const ParagraphButton = ({ editor }: EditorProps) => {
  if (!editor) {
    return null;
  }

  const isActive = editor.isActive("paragraph");

  return (
    <button
      onClick={() => editor.chain().focus().setParagraph().run()}
      className={`p-2 rounded duration-300 cursor-pointer ${
        isActive
          ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      title="Обычный текст (Ctrl+Alt+0)"
      disabled={!editor.can().setParagraph()}
    >
      <Type className="w-5 h-5" />
    </button>
  );
};
