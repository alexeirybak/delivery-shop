import { Clock, Check, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { formatTime } from "../../../../utils/formatTime";
import { FooterProps } from "../../../../types";

export const Footer = ({
  generationStatus,
  elapsedSeconds,
  prompt,
  onCloseClick,
  onInsertToEditor,
  onGenerateImage,
}: FooterProps) => {
  const isGenerating =
    generationStatus === "generating" || generationStatus === "loading";
  const isCompleted = generationStatus === "success";

  const renderStatusMessage = () => {
    switch (generationStatus) {
      case "idle":
        return "Введите описание для генерации";
      case "generating":
        return "Запуск YandexART...";
      case "loading":
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>YandexART: {formatTime(elapsedSeconds)}</span>
          </div>
        );
      case "success":
        return (
          <span className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            Готово!
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            Ошибка
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border-t px-6 py-4 bg-gray-50">
      <div className="flex flex-wrap flex-col md:flex-row justify-between items-center">
        <div className="text-sm mb-4 text-gray-500">{renderStatusMessage()}</div>

        <div className="flex flex-wrap flex-col md:flex-row justify-center gap-3">
          <button
            onClick={onCloseClick}
            disabled={isGenerating}
            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium duration-300 cursor-pointer"
          >
            {isCompleted ? "Закрыть" : "Отмена"}
          </button>

          {isCompleted ? (
            <button
              onClick={onInsertToEditor}
              className="flex-1 px-6 py-2.5 bg-linear-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 font-medium flex items-center gap-2 duration-300 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Вставить в документ
            </button>
          ) : (
            <button
              onClick={onGenerateImage}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 px-6 py-2.5 bg-linear-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 duration-300 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  YandexART работает...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 shrink-0" />
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
