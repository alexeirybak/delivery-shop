import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import { Upload } from "lucide-react";
import { Counter } from "./Counter";
import { useState } from "react";
import MainToolbar from "./MainToolbar";
import { AllowHtmlAttributes } from "./AllowHtmlAttributes";
import { handleImageUpload } from "../../utils/upload-image";
import { TiptapEditorProps } from "../../types/tiptap/tiptap.types";
import "../../styles/tiptap-editor.css";
import { RecordProvider } from "@/app/contexts/RecordContext";
import { CyberLoader } from "@/app/(user-part)/user-dashboard/_components/CyberLoader";

interface TiptapEditorExtendedProps extends TiptapEditorProps {
  categoryName: string;
  recordName: string;
}

export const TiptapEditor = ({
  content,
  onContentChange,
  categoryName,
  recordName,
}: TiptapEditorExtendedProps) => {
  const [stats, setStats] = useState({ characters: 0, words: 0 });
  const [showDragIcon, setShowDragIcon] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: {
          depth: 500,
          newGroupDelay: 100,
        },
        link: {
          openOnClick: false,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyleKit.configure({
        fontSize: {
          types: ["heading", "paragraph", "textStyle"],
        },
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: "Начните писать здесь …",
      }),
      AllowHtmlAttributes,
      TableKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      FileHandler.configure({
        allowedMimeTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ],
        onDrop: async (currentEditor, files) => {
          if (!currentEditor) return;
          for (const file of files) {
            await handleImageUpload(file, currentEditor);
          }
        },
        onPaste: (currentEditor, files, htmlContent) => {
          if (!currentEditor) return;
          if (htmlContent && htmlContent.includes("<img")) {
            return false;
          }
          if (files.length > 0) {
            files.forEach(async (file) => {
              await handleImageUpload(file, currentEditor);
            });
            return true;
          }
          return false;
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange(html);
      const characters = editor.storage.characterCount.characters();
      const words = editor.storage.characterCount.words();
      setStats({ characters, words });
    },
  });

  if (!editor) {
    return (
      <div className="tiptap-editor-loading">
        <div className="tiptap-editor-loading-content">
          <CyberLoader />
          <div className="tiptap-editor-loading-text">
            Инициализация редактора...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tiptap-editor-container">
      <RecordProvider
        value={{
          categoryName: categoryName,
          recordName: recordName,
        }}
      >
        <MainToolbar editor={editor} onImageDragOverChange={setShowDragIcon} />
      </RecordProvider>

      <div className="tiptap-editor-content">
        <EditorContent editor={editor} />
        {showDragIcon && (
          <div className="tiptap-drag-overlay">
            <div className="tiptap-drag-overlay-content">
              <Upload className="tiptap-drag-icon" />
              <p className="tiptap-drag-title">Отпустите изображение</p>
              <p className="tiptap-drag-subtitle">
                Файл будет загружен в редактор
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="tiptap-editor-footer">
        <Counter wordCount={stats.words} charCount={stats.characters} />
      </div>
    </div>
  );
};
