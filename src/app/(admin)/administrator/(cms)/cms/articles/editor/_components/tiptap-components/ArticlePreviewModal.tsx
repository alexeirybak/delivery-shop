import Image from "next/image";
import { X, ExternalLink, AlertTriangle } from "lucide-react";
import { useArticleStore } from "@/store/articleStore";
import "../css/editor.css";

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArticlePreviewModal = ({
  isOpen,
  onClose,
}: ArticlePreviewModalProps) => {
  const { formData } = useArticleStore();

  if (!isOpen) return null;

  const renderArticleContent = () => {
    if (!formData.content) {
      return '<p style="text-align: center; color: #6c757d; font-style: italic;">Контент статьи отсутствует</p>';
    }

    return formData.content;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4 animate-fadeIn">
      <div className="bg-white shadow-2xl w-full h-full flex flex-col animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ExternalLink className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Предпросмотр статьи
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-custom cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
            <h3 className="text-blue-800 mb-1 flex flex-row flex-wrap gap-2">
              <AlertTriangle className="text-red-400" />
              Это предварительный просмотр. Статья еще не сохранена и может
              отличаться от финальной версии.
            </h3>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              {formData.name || "Новая статья"}
            </h1>

            {formData.image && formData.image.trim() !== "" && (
              <div className="relative rounded overflow-hidden shadow-lg">
                <Image
                  src={formData.image}
                  alt={formData.imageAlt || formData.name}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div
              className="ProseMirror tiptap"
              dangerouslySetInnerHTML={{ __html: renderArticleContent() }}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-linear-to-r from-gray-50 to-gray-100">
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-lg font-medium transition-custom cursor-pointer"
              >
                Закрыть предпросмотр
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
