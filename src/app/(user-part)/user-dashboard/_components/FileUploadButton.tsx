import { useRef, useCallback } from "react";
import { FileText } from "lucide-react";
import { FileUploadButtonProps, TextContentItem } from "../types";
import "../styles/file-upload.css";

export const FileUploadButton = ({
  onFileChange,
  disabled = false,
}: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromFile = useCallback(
    async (file: File): Promise<string> => {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        return await file.text();
      }

      if (file.name.endsWith(".docx")) {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      }

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const pdfjs = await import("pdfjs-dist");

        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = (textContent.items as TextContentItem[])
            .map((item) => item.str)
            .join(" ");
          fullText += `===== Page ${i} =====\n${pageText}\n\n`;
        }

        return fullText;
      }

      if (file.name.endsWith(".doc")) {
        throw new Error(
          "Формат .doc не поддерживается. Используйте .docx или PDF.",
        );
      }

      throw new Error(`Формат ${file.name} не поддерживается`);
    },
    [],
  );

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      try {
        const text = await extractTextFromFile(selectedFile);
        onFileChange({
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          text: text,
          mimeType: selectedFile.type,
        });
      } catch (error) {
        console.error("Ошибка:", error);
        onFileChange({
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          text: `[Ошибка: ${error instanceof Error ? error.message : "Не удалось прочитать файл"}]`,
          mimeType: selectedFile.type,
          error: true,
        });
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFileChange, extractTextFromFile],
  );

  if (disabled) {
    return null;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.docx"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="file-upload-btn"
        title="Добавить файл (DOCX, PDF, TXT)"
      >
        <FileText size={20} />
      </button>
    </>
  );
};
