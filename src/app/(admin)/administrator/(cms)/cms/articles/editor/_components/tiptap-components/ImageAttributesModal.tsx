// ImageAttributesModal.tsx
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { X, Image as ImageIcon, Captions } from "lucide-react";
import { EditorProps } from "../../../types";
import { Node as ProseMirrorNode } from "prosemirror-model";

interface ImageAttributes {
  src: string;
  alt: string;
  title: string;
}

interface SelectedImage {
  node: ProseMirrorNode;
  pos: number;
  attrs: ImageAttributes;
}

export const ImageAttributesModal = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageAttributes | null>(null);
  const [attributes, setAttributes] = useState({ alt: "", title: "" });
  const [isImageSelected, setIsImageSelected] = useState(false);

  // Постоянно отслеживаем, выбрано ли изображение
  useEffect(() => {
    if (!editor) return;

    const updateSelectionState = () => {
      const { from, to } = editor.state.selection;
      let imageFound = false;

      editor.state.doc.nodesBetween(from, to, (node) => {
        if (node.type.name === "image") {
          imageFound = true;
          return false; // Прерываем поиск
        }
        return true;
      });

      setIsImageSelected(imageFound);
    };

    // Обновляем состояние при изменении выделения
    editor.on("selectionUpdate", updateSelectionState);
    // И при обновлении транзакций
    editor.on("transaction", updateSelectionState);
    
    // Первоначальная проверка
    updateSelectionState();

    return () => {
      editor.off("selectionUpdate", updateSelectionState);
      editor.off("transaction", updateSelectionState);
    };
  }, [editor]);

  const checkSelectedImage = (): SelectedImage | null => {
    if (!editor) return null;

    const { from, to } = editor.state.selection;
    let selectedImage: SelectedImage | null = null;

    editor.state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "image") {
        selectedImage = {
          node,
          pos,
          attrs: {
            src: String(node.attrs.src || ""),
            alt: String(node.attrs.alt || ""),
            title: String(node.attrs.title || ""),
          },
        };
        return false; // Нашли - можно прервать
      }
      return true;
    });

    return selectedImage;
  };

  const openModal = () => {
    const selectedImage = checkSelectedImage();

    if (selectedImage) {
      setCurrentImage(selectedImage.attrs);
      setAttributes({
        alt: selectedImage.attrs.alt || "",
        title: selectedImage.attrs.title || "",
      });
      setIsOpen(true);
    }
  };

  const applyChanges = () => {
    if (!editor || !currentImage) return;

    const selectedImage = checkSelectedImage();
    if (!selectedImage) {
      setIsOpen(false);
      return;
    }

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        alt: attributes.alt.trim(),
        title: attributes.title.trim(),
      })
      .run();

    setIsOpen(false);
  };

  const resetAttributes = useCallback(() => {
    setAttributes({
      alt: currentImage?.alt || "",
      title: currentImage?.title || "",
    });
  }, [currentImage?.alt, currentImage?.title]);

  const handleClose = useCallback(() => {
    resetAttributes();
    setIsOpen(false);
  }, [resetAttributes]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`p-2 rounded duration-300 cursor-pointer flex items-center gap-1 ${
          isImageSelected
            ? "hover:bg-gray-200 text-gray-600"
            : "text-gray-300 cursor-not-allowed opacity-50"
        }`}
        title={
          isImageSelected
            ? "Изменить alt/title изображения"
            : "Выберите изображение для редактирования атрибутов"
        }
        disabled={!isImageSelected}
      >
        <Captions className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Атрибуты изображения
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded duration-300 cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4">
              {currentImage?.src && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Предпросмотр:</div>
                  <div className="relative border rounded overflow-hidden bg-gray-50" style={{ height: "180px" }}>
                    <Image
                      src={currentImage.src}
                      alt={currentImage.alt || "Изображение"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2 wrap-break-word">
                    {currentImage.src}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="alt-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Alt текст <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="alt-input"
                    type="text"
                    value={attributes.alt}
                    onChange={(e) => setAttributes(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="Описание изображения для доступности"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Важно для доступности и SEO
                  </div>
                </div>

                <div>
                  <label htmlFor="title-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Title (необязательно)
                  </label>
                  <input
                    id="title-input"
                    type="text"
                    value={attributes.title}
                    onChange={(e) => setAttributes(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Всплывающая подсказка при наведении"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Отображается при наведении курсора
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border-t">
              <button
                type="button"
                onClick={resetAttributes}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded duration-300 cursor-pointer"
                disabled={attributes.alt === (currentImage?.alt || "") && 
                         attributes.title === (currentImage?.title || "")}
              >
                Сбросить
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded duration-300 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={applyChanges}
                  className="px-4 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!attributes.alt.trim()}
                >
                  Применить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};