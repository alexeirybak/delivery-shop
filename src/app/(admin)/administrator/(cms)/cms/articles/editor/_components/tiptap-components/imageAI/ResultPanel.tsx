import { Download } from "lucide-react";
import Image from "next/image";
import { ResultPanelProps } from "../../../../types";
import { promptStyles } from "../../../../utils/promptStyles";
import { formatTime } from "../../../../utils/formatTime";

const ResultPanel = ({
  imageUrl,
  selectedStyle,
  selectedAspect,
  elapsedSeconds,
  onDownload,
}: ResultPanelProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Результат:</h3>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-custom cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Скачать
          </button>
        </div>
      </div>
      <div className="bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-300 p-4">
        <Image
          src={imageUrl}
          alt="Сгенерированное изображение YandexART"
          width={1024}
          height={1024}
          className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-lg"
          onError={() => {
            console.error("Ошибка загрузки изображения");
          }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Стиль: {promptStyles.find((s) => s.id === selectedStyle)?.label} |
        Формат: {selectedAspect} | Время генерации: {formatTime(elapsedSeconds)}
      </p>
    </div>
  );
};

export default ResultPanel;
