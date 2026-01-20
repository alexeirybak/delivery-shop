import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ImageAttributesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attrs: { alt: string; title: string }) => void;
  currentAlt: string;
  currentTitle: string;
}

export const ImageAttributesDialog = ({
  isOpen,
  onClose,
  onSave,
  currentAlt,
  currentTitle,
}: ImageAttributesDialogProps) => {
  const [alt, setAlt] = useState(currentAlt || "");
  const [title, setTitle] = useState(currentTitle || "");

  useEffect(() => {
    setAlt(currentAlt || "");
    setTitle(currentTitle || "");
  }, [currentAlt, currentTitle]);

  const handleSave = () => {
    onSave({ alt, title });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-800">Атрибуты изображения</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt текст
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Описание изображения для доступности"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Описание изображения для доступности и SEO
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (подсказка)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Текст подсказки при наведении"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Текст, который появляется при наведении на изображение
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};