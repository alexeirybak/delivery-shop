import { Editor } from "@tiptap/react";

interface CharacterCounterProps {
  editor: Editor;
  maxChars: number;
}

export default function CharacterCounter({
  editor,
  maxChars,
}: CharacterCounterProps) {
  return (
    <div className="border-t px-4 py-3 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-2">
      <div className="flex items-center gap-4">
        <span className="bg-white px-2 py-1 rounded border">
          {editor.storage.characterCount.characters()}/{maxChars} символов
        </span>
        <span className="bg-white px-2 py-1 rounded border">
          {editor.storage.characterCount.words()} слов
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 text-sm rounded border hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-200 cursor-pointer duration-300"
        >
          Отменить (Ctrl+Z)
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 text-sm rounded border hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-200 cursor-pointer duration-300"
        >
          Повторить (Ctrl+Y)
        </button>
      </div>
    </div>
  );
}