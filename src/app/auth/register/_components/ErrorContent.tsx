import { RotateCw, XCircle } from "lucide-react";
import { ErrorContentProps } from "../../types";
import "../styles/error-content.css";

export const ErrorContent = ({
  error,
  title = "Ошибка отправки",
  primaryAction,
  secondaryAction,
}: ErrorContentProps) => {
  return (
    <div className="error-content-container">
      <div className="error-content-inner">
        <div className="error-content-icon-wrapper">
          <div className="error-content-icon-circle">
            <XCircle className="error-content-icon" />
          </div>
          <div className="error-content-text-wrapper">
            <h3 className="error-content-title">{title}</h3>
            {error && <p className="error-content-message">{error}</p>}
          </div>
        </div>

        <div className="error-content-actions">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={`error-content-primary-button ${primaryAction.className || ""}`}
            >
              <span>{primaryAction.label}</span>
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`error-content-secondary-button ${secondaryAction.className || ""}`}
            >
              <RotateCw className="error-content-secondary-icon" />
              <span>{secondaryAction.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
