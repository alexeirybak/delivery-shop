import { AlertCircle } from "lucide-react";
import { ErrorPanelProps } from "../../../types";
import "../../../styles/error-panel.css";

export const ErrorPanel = ({ error }: ErrorPanelProps) => {
  return (
    <div className="error-panel">
      <div className="error-panel-content">
        <AlertCircle className="error-panel-icon" />
        <div>
          <p className="error-panel-title">Ошибка AI</p>
          <p className="error-panel-message">{error}</p>
          <p className="error-panel-hint">
            Проверьте настройки API и повторите попытку
          </p>
        </div>
      </div>
    </div>
  );
};
