import { X, FileText, File, FileArchive } from "lucide-react";
import { FileData } from "../types";
import "../styles/file-preview.css";

interface FilePreviewProps {
  file: FileData | null;
  onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  if (!file) return null;

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return <FileText size={14} />;
    if (fileName.endsWith(".docx")) return <FileText size={14} />;
    if (fileName.endsWith(".txt")) return <File size={14} />;
    return <FileArchive size={14} />;
  };

  return (
    <div className="files-preview">
      <div className="file-preview-item">
        <span className="file-icon">{getFileIcon(file.name)}</span>
        <span className="file-name">{file.name}</span>
        <button
          type="button"
          onClick={onRemove}
          className="remove-file-btn"
          title="Удалить файл"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
