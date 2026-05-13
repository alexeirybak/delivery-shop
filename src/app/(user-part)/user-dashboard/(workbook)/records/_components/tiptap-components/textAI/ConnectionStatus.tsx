import { AlertCircle } from "lucide-react";
import { ConnectionStatusProps } from "../../../types";
import "../../../styles/connection-status.css";

export const ConnectionStatus = ({
  onTestAPI,
  isGenerating,
}: ConnectionStatusProps) => {
  return (
    <div className="connection-status">
      <div className="connection-status-content">
        <div className="connection-status-indicator">
          <span className="connection-status-dot"></span>
          <strong className="connection-status-text">AI подключен</strong>
        </div>
        <button
          onClick={onTestAPI}
          disabled={isGenerating}
          className="connection-test-btn"
        >
          <AlertCircle />
          Тест API
        </button>
      </div>
    </div>
  );
};
