import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Captions,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Maximize2,
  Crop,
} from "lucide-react";
import { EditorProps } from "../../../types";
import { Node as ProseMirrorNode } from "prosemirror-model";

interface ImageAttributes {
  src: string;
  alt: string;
  title: string;
  width?: string;
  height?: string;
  align?: "left" | "right" | "center" | "none";
  style?: string;
}

interface SelectedImage {
  node: ProseMirrorNode;
  pos: number;
  attrs: ImageAttributes;
}

// Функция для извлечения значения из style
const extractStyleValue = (style: string, property: string): string | null => {
  if (!style) return null;
  const match = style.match(new RegExp(`${property}:\\s*([^;]+)`));
  return match ? match[1].trim() : null;
};

// Функция для определения выравнивания из стилей
const getAlignFromStyle = (
  style: string,
): "left" | "right" | "center" | "none" => {
  if (!style) return "none";

  if (style.includes("float: left") || style.includes("float:left"))
    return "left";
  if (style.includes("float: right") || style.includes("float:right"))
    return "right";
  if (
    style.includes("margin: 0 auto") ||
    style.includes("margin-left: auto") ||
    style.includes("margin-right: auto")
  )
    return "center";

  return "none";
};

// Преобразование единиц измерения
const parseDimension = (value: string): string => {
  if (!value) return "";

  // Если уже есть единицы измерения, оставляем как есть
  if (/^\d+(px|%|em|rem|vw|vh)$/.test(value)) return value;

  // Если просто число, добавляем px
  if (/^\d+$/.test(value)) return `${value}px`;

  return value;
};

export const ImageAttributesModal = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageAttributes | null>(
    null,
  );
  const [attributes, setAttributes] = useState({
    alt: "",
    title: "",
    width: "",
    height: "",
    align: "none" as "left" | "right" | "center" | "none",
  });
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

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

    editor.on("selectionUpdate", updateSelectionState);
    editor.on("transaction", updateSelectionState);

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
        const attrs = node.attrs;
        const style = attrs.style || "";

        // Извлекаем ширину и высоту ТОЛЬКО из стилей
        let width = "";
        let height = "";

        // Парсим из style
        const widthFromStyle = extractStyleValue(style, "width");
        const heightFromStyle = extractStyleValue(style, "height");

        if (widthFromStyle) width = widthFromStyle;
        if (heightFromStyle) height = heightFromStyle;

        // Если не нашли в style, пробуем из отдельных атрибутов (для обратной совместимости)
        if (!width && attrs.width) {
          width = String(attrs.width);
        }
        if (!height && attrs.height) {
          height = String(attrs.height);
        }

        selectedImage = {
          node,
          pos,
          attrs: {
            src: String(attrs.src || ""),
            alt: String(attrs.alt || ""),
            title: String(attrs.title || ""),
            width,
            height,
            align: getAlignFromStyle(style),
            style,
          },
        };
        return false;
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
        width: selectedImage.attrs.width || "",
        height: selectedImage.attrs.height || "",
        align: selectedImage.attrs.align || "none",
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

    console.log("Selected image position:", selectedImage.pos);
    console.log("Original attributes:", selectedImage.attrs);

    const styles = [];

    // Размеры ТОЛЬКО в style
    if (attributes.width) {
      const widthValue = parseDimension(attributes.width);
      styles.push(`width: ${widthValue}`);
      console.log("Setting width in style:", widthValue);
    }
    if (attributes.height) {
      const heightValue = parseDimension(attributes.height);
      styles.push(`height: ${heightValue}`);
      console.log("Setting height in style:", heightValue);
    }

    // Выравнивание
    switch (attributes.align) {
      case "left":
        styles.push("float: left");
        styles.push("margin-right: 15px");
        styles.push("margin-bottom: 15px");
        break;
      case "right":
        styles.push("float: right");
        styles.push("margin-left: 15px");
        styles.push("margin-bottom: 15px");
        break;
      case "center":
        styles.push("display: block");
        styles.push("margin: 15px auto");
        break;
      case "none":
        styles.push("float: none");
        styles.push("margin: 15px 0");
        break;
    }

    const styleString = styles.join("; ");
    console.log("Final style string:", styleString);

    // ВАЖНО: width и height устанавливаются как null, чтобы удалить их
    const newAttrs = {
      src: selectedImage.attrs.src,
      alt: attributes.alt.trim(),
      title: attributes.title.trim(),
      // Устанавливаем width и height как null, чтобы удалить отдельные атрибуты
      width: null,
      height: null,
      // Все размеры и выравнивание только в style
      style: styleString,
    };

    console.log("New attributes:", newAttrs);

    editor
      .chain()
      .focus()
      .setNodeSelection(selectedImage.pos)
      .updateAttributes("image", newAttrs)
      .run();

    console.log("Attributes updated");

    setIsOpen(false);
  };

  const resetAttributes = useCallback(() => {
    setAttributes({
      alt: currentImage?.alt || "",
      title: currentImage?.title || "",
      width: currentImage?.width || "",
      height: currentImage?.height || "",
      align: currentImage?.align || "none",
    });
  }, [currentImage]);

  const handleClose = useCallback(() => {
    resetAttributes();
    setIsOpen(false);
  }, [resetAttributes]);

  const setPresetSize = (preset: "small" | "medium" | "large" | "original") => {
    const presets = {
      small: { width: "300", height: "" },
      medium: { width: "500", height: "" },
      large: { width: "800", height: "" },
      original: { width: "", height: "" },
    };

    setAttributes((prev) => ({
      ...prev,
      width: presets[preset].width,
      height: presets[preset].height,
    }));
  };

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
            ? "Изменить атрибуты изображения"
            : "Выберите изображение для редактирования атрибутов"
        }
        disabled={!isImageSelected}
      >
        <Crop className="w-4 h-4" />
      </button>

      {isOpen && (
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
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded duration-300 cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Вкладки */}
              <div className="flex border-b mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("basic")}
                  className={`px-4 py-2 text-sm font-medium duration-300 cursor-pointer ${activeTab === "basic" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <span className="flex items-center gap-2">
                    <Captions className="w-4 h-4" />
                    Основное
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("advanced")}
                  className={`px-4 py-2 text-sm font-medium duration-300 cursor-pointer ${activeTab === "advanced" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <span className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4" />
                    Размер и позиция
                  </span>
                </button>
              </div>

              {currentImage?.src && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Предпросмотр:
                  </div>
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

              {activeTab === "basic" && (
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

              {activeTab === "advanced" && (
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
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded duration-300 cursor-pointer"
                        >
                          М
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetSize("medium")}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded duration-300 cursor-pointer"
                        >
                          Ср
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetSize("large")}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded duration-300 cursor-pointer"
                        >
                          Б
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetSize("original")}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded duration-300 cursor-pointer"
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
                        className={`flex-1 py-2 px-3 rounded flex flex-col items-center justify-center gap-1 duration-300 cursor-pointer ${
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
                        className={`flex-1 py-2 px-3 rounded flex flex-col items-center justify-center gap-1 duration-300 cursor-pointer ${
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
                        className={`flex-1 py-2 px-3 rounded flex flex-col items-center justify-center gap-1 duration-300 cursor-pointer ${
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
                        className={`flex-1 py-2 px-3 rounded flex flex-col items-center justify-center gap-1 duration-300 cursor-pointer ${
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
                onClick={resetAttributes}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded duration-300 cursor-pointer"
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
