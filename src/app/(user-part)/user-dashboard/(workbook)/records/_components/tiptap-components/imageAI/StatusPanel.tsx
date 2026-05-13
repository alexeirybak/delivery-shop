import { RefreshCw, PlayCircle, Clock } from "lucide-react";
import { StatusPanelProps } from "../../../types";
import { formatGenerateTime } from "../../../utils/formatGenerateTime";
import "../../../styles/status-panel.css";

export const StatusPanel = ({
  status,
  elapsedSeconds,
}: StatusPanelProps) => {
  const progress = Math.min(elapsedSeconds * 3, 100);

  return (
    <div className="status-panel">
      <div className="status-panel-content">
        <div className="status-panel-icon-wrapper">
          <RefreshCw className="status-panel-spinner" />
          <PlayCircle className="status-panel-play-icon" />
        </div>
        <div className="status-panel-info">
          <p className="status-panel-title">
            {status === "generating"
              ? "Запуск AI..."
              : "AI генерирует..."}
          </p>
          <p className="status-panel-timer">
            <Clock />
            Прошло: {formatGenerateTime(elapsedSeconds)}
          </p>
        </div>
      </div>

      <div className="status-panel-progress">
        <div className="status-panel-progress-bar">
          <div
            className="status-panel-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="status-panel-hint">
        AI создает изображение. Это может занять до минуты.
      </p>
    </div>
  );
};
