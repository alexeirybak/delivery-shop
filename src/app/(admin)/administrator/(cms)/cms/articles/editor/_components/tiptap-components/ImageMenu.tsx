import { ImagePlus, Upload } from "lucide-react";
import { useRef, useCallback, ChangeEvent } from "react";
import { EditorProps } from "../../../types";
import { useImageUpload } from "../../hooks/useImageUpload";

export const ImageMenu = ({ editor }: EditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Используем хук
  const { isUploading, uploadFile, insertByUrl } = useImageUpload(editor);

  // Обработчик для input
  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      await uploadFile(files[0]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadFile]
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-1">Изображения:</span>

      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`px-1 py-2 rounded duration-300 cursor-pointer flex items-center gap-1 ${
            isUploading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-200 text-gray-600"
          }`}
          title={isUploading ? "Загрузка..." : "Загрузить изображение"}
          disabled={isUploading}
        >
          <Upload className={`w-4 h-4 ${isUploading ? "animate-pulse" : ""}`} />
          {isUploading && <span className="text-xs">...</span>}
        </button>
      </div>

      <button
        type="button"
        onClick={insertByUrl}
        className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600"
        title="Вставить по URL"
        disabled={isUploading}
      >
        <ImagePlus className="w-4 h-4" />
      </button>
    </div>
  );
};