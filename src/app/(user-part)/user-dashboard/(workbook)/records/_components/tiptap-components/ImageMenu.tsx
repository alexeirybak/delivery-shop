import { ImagePlus, Upload } from "lucide-react";
import { useRef, useCallback, ChangeEvent } from "react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { EditorProps } from "../../types";
import "../../styles/image-menu.css";

interface ImageMenuProps extends EditorProps {
  onDragOverChange?: (isDragging: boolean) => void;
}

export const ImageMenu = ({ editor, onDragOverChange }: ImageMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadFile, insertByUrl } = useImageUpload(editor);

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      await uploadFile(files[0]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadFile],
  );

  const handleButtonMouseEnter = () => {
    if (onDragOverChange) {
      onDragOverChange(true);
    }
  };

  const handleButtonMouseLeave = () => {
    if (onDragOverChange) {
      onDragOverChange(false);
    }
  };

  return (
    <div className="image-menu">
      <div
        className="image-menu-group"
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
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
          className="image-menu-upload-btn"
          title={isUploading ? "Загрузка..." : "Загрузить изображение"}
          disabled={isUploading}
        >
          <Upload />
        </button>
      </div>

      <button
        type="button"
        onClick={insertByUrl}
        className="image-menu-url-btn"
        title="Вставить по ссылке"
        disabled={isUploading}
      >
        <ImagePlus />
      </button>
    </div>
  );
};
