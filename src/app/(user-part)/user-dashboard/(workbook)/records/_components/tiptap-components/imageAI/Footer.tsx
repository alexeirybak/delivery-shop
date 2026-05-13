import { Check, RefreshCw, Sparkles } from "lucide-react";
import { FooterProps } from "../../../types";
import "../../../styles/footer-image-ai.css";

export const Footer = ({
  generationStatus,
  prompt,
  onCloseClick,
  onInsertToEditor,
  onGenerateImage,
}: FooterProps) => {
  const isGenerating =
    generationStatus === "generating" || generationStatus === "loading";
  const isCompleted = generationStatus === "success";

  return (
    <div className="image-footer">
      <div className="image-footer-content">
        <div className="image-footer-buttons">
          <button
            onClick={onCloseClick}
            disabled={isGenerating}
            className="image-footer-cancel-btn"
          >
            {isCompleted ? "Закрыть" : "Отмена"}
          </button>

          {isCompleted ? (
            <button
              onClick={onInsertToEditor}
              className="image-footer-action-btn"
            >
              <Check />
              Вставить в документ
            </button>
          ) : (
            <button
              onClick={onGenerateImage}
              disabled={isGenerating || !prompt.trim()}
              className="image-footer-action-btn"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="image-footer-spinner" />
                  AI работает...
                </>
              ) : (
                <>
                  <Sparkles />
                  Создать изображение
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
