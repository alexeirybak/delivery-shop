import Image from "next/image";
import {
  X,
  Image as ImageIcon,
  Captions,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Maximize2,
} from "lucide-react";
import { useState } from "react";
import { ImageAttributesModalContentProps } from "../../../types";

export const ImageAttributesModal = ({
  currentImage,
  attributes,
  setAttributes,
  activeTab,
  setActiveTab,
  setPresetSize,
  onClose,
  onApply,
  onReset,
}: ImageAttributesModalContentProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState<
    "basic" | "advanced"
  >(activeTab);

  const handleTabChange = (tab: "basic" | "advanced") => {
    setInternalActiveTab(tab);
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Атрибуты изображения
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-custom cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Вкладки */}
          <div className="flex border-b-blue-500 mb-4">
            <button
              type="button"
              onClick={() => handleTabChange("basic")}
              className={`px-4 py-2 text-sm font-medium transition-custom cursor-pointer ${internalActiveTab === "basic" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <span className="flex items-center gap-2">
                <Captions className="w-4 h-4" />
                Основное
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("advanced")}
              className={`px-4 py-2 text-sm font-medium transition-custom cursor-pointer ${internalActiveTab === "advanced" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <span className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                Размер и позиция
              </span>
            </button>
          </div>

          {currentImage?.src && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Предпросмотр:</div>
              <div
                className="relative border rounded overflow-hidden bg-gray-50"
                style={{ height: "200px" }}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || "Изображение"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-2"
                />
              </div>
              <div className="text-xs text-gray-500 mt-2 wrap-break-word truncate">
                {currentImage.src}
              </div>
            </div>
          )}

          {internalActiveTab === "basic" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="alt-input"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alt текст <span className="text-red-500">*</span>
                </label>
                <input
                  id="alt-input"
                  type="text"
                  value={attributes.alt}
                  onChange={(e) =>
                    setAttributes((prev) => ({
                      ...prev,
                      alt: e.target.value,
                    }))
                  }
                  placeholder="Описание изображения для доступности"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="text-xs text-gray-500 mt-1">
                  Важно для доступности и SEO
                </div>
              </div>

              <div>
                <label
                  htmlFor="title-input"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title (необязательно)
                </label>
                <input
                  id="title-input"
                  type="text"
                  value={attributes.title}
                  onChange={(e) =>
                    setAttributes((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Всплывающая подсказка при наведении"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Отображается при наведении курсора
                </div>
              </div>
            </div>
          )}

          {internalActiveTab === "advanced" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Размеры
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPresetSize("small")}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-custom cursor-pointer"
                    >
                      М
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetSize("medium")}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-custom cursor-pointer"
                    >
                      Ср
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetSize("large")}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-custom cursor-pointer"
                    >
                      Б
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetSize("original")}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-custom cursor-pointer"
                    >
                      Ориг
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="width-input"
                      className="block text-xs text-gray-600 mb-1"
                    >
                      Ширина
                    </label>
                    <input
                      id="width-input"
                      type="text"
                      value={attributes.width}
                      onChange={(e) =>
                        setAttributes((prev) => ({
                          ...prev,
                          width: e.target.value,
                        }))
                      }
                      placeholder="300px, 50%, auto"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="height-input"
                      className="block text-xs text-gray-600 mb-1"
                    >
                      Высота
                    </label>
                    <input
                      id="height-input"
                      type="text"
                      value={attributes.height}
                      onChange={(e) =>
                        setAttributes((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }))
                      }
                      placeholder="200px, auto"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Используйте px, %, em, rem, vw, vh или оставьте пустым для
                  auto
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Выравнивание
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAttributes((prev) => ({ ...prev, align: "left" }))
                    }
                    className={`flex-1 py-2 px-3 rounded flex flex-col items-center justify-center gap-1 transition-custom cursor-pointer ${
                      attributes.align === "left"
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <AlignLeft className="w-5 h-5" />
                    <span className="text-xs">Слева</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttributes((prev) => ({
                        ...prev,
                        align: "center",
                      }))
                    }
                    className={`flex-1 py-2 px-3 rounded flex flex-col items-center justify-center gap-1 transition-custom cursor-pointer ${
                      attributes.align === "center"
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <AlignCenter className="w-5 h-5" />
                    <span className="text-xs">По центру</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttributes((prev) => ({ ...prev, align: "right" }))
                    }
                    className={`flex-1 py-2 px-3 rounded flex flex-col items-center justify-center gap-1 transition-custom cursor-pointer ${
                      attributes.align === "right"
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <AlignRight className="w-5 h-5" />
                    <span className="text-xs">Справа</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttributes((prev) => ({ ...prev, align: "none" }))
                    }
                    className={`flex-1 py-2 px-3 rounded flex flex-col items-center justify-center gap-1 transition-custom cursor-pointer ${
                      attributes.align === "none"
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-3 h-3 border border-gray-400"></div>
                    </div>
                    <span className="text-xs">Нет</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-custom cursor-pointer"
            disabled={
              attributes.alt === (currentImage?.alt || "") &&
              attributes.title === (currentImage?.title || "") &&
              attributes.width === (currentImage?.width || "") &&
              attributes.height === (currentImage?.height || "") &&
              attributes.align === (currentImage?.align || "none")
            }
          >
            Сбросить
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-custom cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={onApply}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-custom cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!attributes.alt.trim()}
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
