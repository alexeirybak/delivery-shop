import { useState, useCallback, useEffect } from "react";
import { EditorProps, ImageAttributesState, SelectedImage } from "../../../types";
import { Crop } from "lucide-react";
import { ImageAttributesModal } from "./ImageAttributesModal";

// Функция для извлечения значения из style
const extractStyleValue = (style: string, property: string): string | null => {
  if (!style) return null;

  const normalizedStyle = style.replace(/\s*;\s*/g, ";").trim();
  const regex = new RegExp(`${property}\\s*:\\s*([^;]+)`, "i");
  const match = normalizedStyle.match(regex);
  return match ? match[1].trim() : null;
};

// Функция для определения выравнивания из стилей
const getAlignFromStyle = (
  style: string,
): "left" | "right" | "center" | "none" => {
  if (!style) return "none";

  const normalizedStyle = style.toLowerCase().replace(/\s+/g, " ");

  if (
    normalizedStyle.includes("float: left") ||
    normalizedStyle.includes("float:left")
  ) {
    return "left";
  }

  if (
    normalizedStyle.includes("float: right") ||
    normalizedStyle.includes("float:right")
  ) {
    return "right";
  }

  const marginLeft =
    extractStyleValue(style, "margin-left") ||
    extractStyleValue(style, "marginLeft");
  const marginRight =
    extractStyleValue(style, "margin-right") ||
    extractStyleValue(style, "marginRight");
  const margin = extractStyleValue(style, "margin");

  if (margin === "0 auto" || margin === "auto") {
    return "center";
  }

  if (marginLeft === "auto" && marginRight === "auto") {
    return "center";
  }

  const textAlign = extractStyleValue(style, "text-align");
  if (textAlign === "center") {
    return "center";
  }

  if (
    (normalizedStyle.includes("display: block") &&
      normalizedStyle.includes("margin:") &&
      normalizedStyle.includes("auto")) ||
    (normalizedStyle.includes("margin-left: auto") &&
      normalizedStyle.includes("margin-right: auto"))
  ) {
    return "center";
  }

  return "none";
};

// Функция для парсинга всех стилей в объект
const parseStyles = (styleString: string): Record<string, string> => {
  const styles: Record<string, string> = {};

  if (!styleString) return styles;

  const stylePairs = styleString.split(";").filter((pair) => pair.trim());

  stylePairs.forEach((pair) => {
    const [key, value] = pair.split(":").map((s) => s.trim());
    if (key && value) {
      styles[key.toLowerCase()] = value;
    }
  });

  return styles;
};

export const ImageAttributes = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageAttributesState | null>(
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

  // Постоянно отслеживаем, выбрано ли изображение
  useEffect(() => {
    if (!editor) return;

    const updateSelectionState = () => {
      const { from, to } = editor.state.selection;
      let imageFound = false;

      editor.state.doc.nodesBetween(from, to, (node) => {
        if (node.type.name === "image") {
          imageFound = true;
          return false;
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

  const checkSelectedImage = useCallback((): SelectedImage | null => {
    if (!editor) return null;

    const { from, to } = editor.state.selection;
    let selectedImage: SelectedImage | null = null;

    editor.state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "image") {
        const attrs = node.attrs;
        const style = attrs.style || "";

        const styles = parseStyles(style);

        let width = styles.width || "";
        let height = styles.height || "";

        if (!width && attrs.width) {
          width = String(attrs.width);
        }
        if (!height && attrs.height) {
          height = String(attrs.height);
        }

        const align = getAlignFromStyle(style);

        selectedImage = {
          node,
          pos,
          attrs: {
            src: String(attrs.src || ""),
            alt: String(attrs.alt || ""),
            title: String(attrs.title || ""),
            width,
            height,
            align,
            style,
          },
        };
        return false;
      }
      return true;
    });

    return selectedImage;
  }, [editor]);

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

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApplyChanges = useCallback(() => {
    if (!editor || !currentImage) return;

    const selectedImage = checkSelectedImage();
    if (!selectedImage) {
      setIsOpen(false);
      return;
    }

    const parseDimension = (value: string): string => {
      if (!value) return "";
      const trimmed = value.trim();

      if (/^\d+(px|%|em|rem|vw|vh|auto)$/i.test(trimmed)) return trimmed;
      if (/^\d+$/.test(trimmed)) return `${trimmed}px`;
      if (trimmed.toLowerCase() === "auto" || trimmed === "") return "";
      return trimmed;
    };

    const styles = [];

    if (attributes.width) {
      const widthValue = parseDimension(attributes.width);
      styles.push(`width: ${widthValue}`);
    }
    if (attributes.height) {
      const heightValue = parseDimension(attributes.height);
      styles.push(`height: ${heightValue}`);
    }

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
        styles.push("margin-left: auto");
        styles.push("margin-right: auto");
        styles.push("margin-top: 15px");
        styles.push("margin-bottom: 15px");
        break;
      case "none":
        styles.push("display: inline-block");
        styles.push("margin: 15px 0");
        break;
    }

    const styleString = styles.join("; ");

    const newAttrs = {
      src: selectedImage.attrs.src,
      alt: attributes.alt.trim(),
      title: attributes.title.trim(),
      width: null,
      height: null,
      style: styleString,
    };

    editor
      .chain()
      .focus()
      .setNodeSelection(selectedImage.pos)
      .updateAttributes("image", newAttrs)
      .run();

    setIsOpen(false);
  }, [
    editor,
    currentImage,
    checkSelectedImage,
    attributes.width,
    attributes.height,
    attributes.align,
    attributes.alt,
    attributes.title,
  ]);

  const handleResetAttributes = useCallback(() => {
    setAttributes({
      alt: currentImage?.alt || "",
      title: currentImage?.title || "",
      width: currentImage?.width || "",
      height: currentImage?.height || "",
      align: currentImage?.align || "none",
    });
  }, [currentImage]);

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
        <ImageAttributesModal
          currentImage={currentImage}
          attributes={attributes}
          setAttributes={setAttributes}
          activeTab="basic"
          setActiveTab={() => {}}
          setPresetSize={setPresetSize}
          onClose={handleClose}
          onApply={handleApplyChanges}
          onReset={handleResetAttributes}
        />
      )}
    </>
  );
};
