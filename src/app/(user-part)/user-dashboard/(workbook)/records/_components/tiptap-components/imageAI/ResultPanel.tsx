import { Download } from "lucide-react";
import Image from "next/image";
import { promptStyles } from "../../../utils/promptStyles";
import { ResultPanelProps } from "../../../types";
import { formatGenerateTime } from "../../../utils/formatGenerateTime";
import "../../../styles/result-panel.css";

export const ResultPanel = ({
  imageUrl,
  selectedStyle,
  selectedAspect,
  elapsedSeconds,
  onDownload,
}: ResultPanelProps) => {
  return (
    <div className="result-panel">
      <div className="result-panel-header">
        <h3 className="result-panel-title">Результат:</h3>
        <div className="result-panel-actions">
          <button
            type="button"
            onClick={onDownload}
            className="result-download-btn"
          >
            <Download />
            Скачать
          </button>
        </div>
      </div>
      <div className="result-image-container">
        <Image
          src={imageUrl}
          alt="Сгенерированное AI изображение"
          width={1024}
          height={1024}
          className="result-image"
          unoptimized={true}
          onError={() => {
            console.error("Ошибка загрузки изображения:", imageUrl);
          }}
        />
      </div>
      <p className="result-info">
        Стиль: {promptStyles.find((s) => s.id === selectedStyle)?.label} |
        Формат: {selectedAspect} | Время генерации: {formatGenerateTime(elapsedSeconds)}
      </p>
    </div>
  );
};