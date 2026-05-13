import Image from "next/image";
import { useRef } from "react";
import mammoth from "mammoth";
import { EditorProps } from "../../types";
import { useEditorExports } from "../../hooks/useEditorExports";
import { useRecordContext } from "@/app/contexts/RecordContext";
import "../../styles/export-button.css";
import { CyberLoader } from "@/app/(user-part)/user-dashboard/_components/CyberLoader";

export const ExportButton = ({ editor }: EditorProps) => {
  const { categoryName, recordName } = useRecordContext();
  const { downloading, downloadAsWordFile, downloadAsPDFFile } =
    useEditorExports();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      alert("Пожалуйста, выберите файл в формате .docx");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      if (editor && html) {
        editor.commands.setContent(html);
      }
    } catch (error) {
      console.error("Ошибка при загрузке Word файла:", error);
      alert("Не удалось загрузить файл. Проверьте формат и попробуйте снова.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!editor) return null;

  return (
    <div className="export-buttons">
      <input
        type="file"
        ref={fileInputRef}
        accept=".docx"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="export-btn"
        title="Загрузить Word документ"
      >
        <div className="export-btn-content">
          <Image
            src="/icons/icon-microsoft-word.svg"
            alt="Загрузить Word"
            width={20}
            height={20}
            className="export-icon"
          />
          <span className="export-arrow">↑</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => downloadAsWordFile(editor, categoryName, recordName)}
        className="export-btn"
        title="Скачать в формате Word"
        disabled={downloading !== null}
      >
        {downloading === "word" ? (
          <CyberLoader />
        ) : (
          <div className="export-btn-content">
            <Image
              src="/icons/icon-microsoft-word.svg"
              alt="Скачать Word"
              width={20}
              height={20}
              className="export-icon"
            />
            <span className="export-arrow">↓</span>
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={() => downloadAsPDFFile(editor, categoryName, recordName)}
        className="export-btn"
        title="Сохранить как PDF"
        disabled={downloading !== null}
      >
        {downloading === "pdf" ? (
          <CyberLoader />
        ) : (
          <div className="export-btn-content">
            <Image
              src="/icons/icon-pdf.svg"
              alt="Скачать в PDF"
              width={20}
              height={20}
              className="export-icon"
            />
            <span className="export-arrow">↓</span>
          </div>
        )}
      </button>
    </div>
  );
};
