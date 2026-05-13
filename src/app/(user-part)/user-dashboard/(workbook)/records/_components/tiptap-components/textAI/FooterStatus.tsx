import { RefreshCw, Send } from "lucide-react";
import { FooterStatusProps } from "../../../types";
import "../../../styles/footer-status.css";

export const FooterStatus = ({
  selectedText,
  aiStatus,
  onCancel,
  onSubmit,
  isGenerating,
  isSubmitDisabled,
  errorDetails,
}: FooterStatusProps) => {
  return (
    <div className="footer-status">
      <div className="footer-status-content">
        <div className="footer-status-text">
          <strong>Выделенный текст:</strong>
          <span>
            {selectedText === ""
              ? "Нет выделения"
              : `${selectedText.substring(0, 100)}...`}
          </span>
        </div>

        <div className="footer-status-buttons">
          <button
            onClick={onCancel}
            disabled={isGenerating}
            className="footer-cancel-btn"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isGenerating || isSubmitDisabled}
            className="footer-submit-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="footer-submit-spinner" />
                AI генерирует...
              </>
            ) : (
              <>
                <Send />
                Запросить у AI
              </>
            )}
          </button>
        </div>
      </div>

      {aiStatus !== "idle" && (
        <div
          className={`footer-status-message ${
            aiStatus === "loading"
              ? "loading"
              : aiStatus === "success"
                ? "success"
                : "error"
          }`}
        >
          <div className="footer-status-message-content">
            {aiStatus === "loading" ? (
              <>
                <RefreshCw className="footer-status-message-icon spin" />
                <span>AI обрабатывает запрос...</span>
              </>
            ) : aiStatus === "success" ? (
              <>
                <span className="footer-status-message-icon">✓</span>
                <span>Текст успешно сгенерирован!</span>
              </>
            ) : (
              <>
                <span className="footer-status-message-icon">✗</span>
                <span>Ошибка AI</span>
              </>
            )}
          </div>
          {errorDetails && (
            <div className="footer-status-error-details">{errorDetails}</div>
          )}
        </div>
      )}
    </div>
  );
};
