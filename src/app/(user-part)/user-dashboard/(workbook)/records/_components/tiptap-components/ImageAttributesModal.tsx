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
import { ImageAttributesModalContentProps } from "../../types";
import "../../styles/image-attributes-modal.css";

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
    <div className="image-attributes-modal-overlay">
      <div className="image-attributes-modal-container">
        <div className="image-attributes-modal-header">
          <div className="image-attributes-modal-title">
            <ImageIcon />
            <h3>Атрибуты изображения</h3>
          </div>
          <button
            onClick={onClose}
            className="image-attributes-modal-close"
            aria-label="Закрыть"
          >
            <X />
          </button>
        </div>

        <div className="image-attributes-modal-body">
          <div className="image-attributes-tabs">
            <button
              type="button"
              onClick={() => handleTabChange("basic")}
              className={`image-attributes-tab ${internalActiveTab === "basic" ? "active" : ""}`}
            >
              <span>
                <Captions />
                Основное
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("advanced")}
              className={`image-attributes-tab ${internalActiveTab === "advanced" ? "active" : ""}`}
            >
              <span>
                <Maximize2 />
                Размер и позиция
              </span>
            </button>
          </div>

          {currentImage?.src && (
            <div className="image-attributes-preview">
              <div className="image-attributes-preview-label">Предпросмотр:</div>
              <div className="image-attributes-preview-image">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || "Изображение"}
                  fill
                  unoptimized
                />
              </div>
            </div>
          )}

          {internalActiveTab === "basic" && (
            <div className="image-attributes-form">
              <div className="image-attributes-field">
                <label htmlFor="alt-input" className="image-attributes-label">
                  Alt текст <span>*</span>
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
                  className="image-attributes-input"
                  autoFocus
                />
                <div className="image-attributes-hint">
                  Важно для доступности и SEO
                </div>
              </div>

              <div className="image-attributes-field">
                <label htmlFor="title-input" className="image-attributes-label">
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
                  className="image-attributes-input"
                />
                <div className="image-attributes-hint">
                  Отображается при наведении курсора
                </div>
              </div>
            </div>
          )}

          {internalActiveTab === "advanced" && (
            <div className="image-attributes-form">
              <div>
                <div className="image-attributes-size-header">
                  <label className="image-attributes-label">Размеры</label>
                  <div className="image-attributes-presets">
                    <button
                      type="button"
                      onClick={() => setPresetSize("small")}
                      className="image-attributes-preset-btn"
                    >
                      М
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetSize("medium")}
                      className="image-attributes-preset-btn"
                    >
                      Ср
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetSize("large")}
                      className="image-attributes-preset-btn"
                    >
                      Б
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetSize("original")}
                      className="image-attributes-preset-btn"
                    >
                      Ориг
                    </button>
                  </div>
                </div>

                <div className="image-attributes-size-grid">
                  <div className="image-attributes-size-field">
                    <label htmlFor="width-input" className="image-attributes-size-label">
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
                      className="image-attributes-input"
                    />
                  </div>
                  <div className="image-attributes-size-field">
                    <label htmlFor="height-input" className="image-attributes-size-label">
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
                      className="image-attributes-input"
                    />
                  </div>
                </div>
                <div className="image-attributes-hint">
                  Используйте px, %, em, rem, vw, vh или оставьте пустым для auto
                </div>
              </div>

              <div>
                <label className="image-attributes-label">Выравнивание</label>
                <div className="image-attributes-align-buttons">
                  <button
                    type="button"
                    onClick={() =>
                      setAttributes((prev) => ({ ...prev, align: "left" }))
                    }
                    className={`image-attributes-align-btn ${attributes.align === "left" ? "active" : ""}`}
                  >
                    <AlignLeft />
                    <span>Слева</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttributes((prev) => ({ ...prev, align: "center" }))
                    }
                    className={`image-attributes-align-btn ${attributes.align === "center" ? "active" : ""}`}
                  >
                    <AlignCenter />
                    <span>По центру</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttributes((prev) => ({ ...prev, align: "right" }))
                    }
                    className={`image-attributes-align-btn ${attributes.align === "right" ? "active" : ""}`}
                  >
                    <AlignRight />
                    <span>Справа</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttributes((prev) => ({ ...prev, align: "none" }))
                    }
                    className={`image-attributes-align-btn ${attributes.align === "none" ? "active" : ""}`}
                  >
                    <div className="image-attributes-align-icon">
                      <div className="image-attributes-align-icon-square"></div>
                    </div>
                    <span>Нет</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="image-attributes-modal-footer">
          <button
            type="button"
            onClick={onReset}
            className="image-attributes-reset-btn"
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

          <div className="image-attributes-actions">
            <button
              type="button"
              onClick={onClose}
              className="image-attributes-cancel-btn"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={onApply}
              className="image-attributes-apply-btn"
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