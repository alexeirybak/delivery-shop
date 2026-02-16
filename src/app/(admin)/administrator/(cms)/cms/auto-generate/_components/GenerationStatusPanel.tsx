import { RefreshCw, PlayCircle, Clock } from "lucide-react";
import { GenerationStatusPanelProps } from "../types/auto-generate.types";
import { getStatusText } from "../utils/getStatusText";

export const GenerationStatusPanel = ({
  status,
  elapsedSeconds,
  operationId,
  currentStep = "1",
  totalSteps = "3",
  currentStepName = "Основное изображение",
}: GenerationStatusPanelProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (status === "success") return 100;
    if (status === "error") return 0;

    // Базовый прогресс на основе времени
    const baseProgress = Math.min(elapsedSeconds * 2, 70);

    // Добавляем прогресс за текущий шаг
    const stepProgress =
      (parseInt(currentStep) - 1) * (100 / parseInt(totalSteps));

    return Math.min(baseProgress + stepProgress, 95);
  };

  return (
    <div className="mb-6 p-6 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="relative">
          <RefreshCw
            className={`w-12 h-12 text-blue-600 ${status === "loading" || status === "generating" ? "animate-spin" : ""}`}
          />
          <PlayCircle className="w-6 h-6 text-blue-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-800">
            {getStatusText(currentStepName)}
          </p>
          <p className="text-sm text-blue-600 mt-1 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Прошло: {formatTime(elapsedSeconds)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Прогресс-бар */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-cyan-500 duration-300 transition-all"
            style={{
              width: `${getProgressPercentage()}%`,
            }}
          />
        </div>

        {/* Информация о шагах */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Шаг {currentStep} из {totalSteps}
          </span>
          <span className="font-medium text-blue-700">{currentStepName}</span>
        </div>

        {/* ID операции */}
        {operationId && (
          <div className="text-xs text-blue-600 text-center mt-2 bg-blue-100 px-3 py-1 rounded-full">
            ID операции: {operationId.substring(0, 20)}...
          </div>
        )}

        {/* Сообщение о времени */}
        <p className="text-sm text-gray-600 text-center">
          {status === "loading" || status === "generating"
            ? `Генерация изображений может занять до 2 минут`
            : status === "success"
              ? "Все изображения сгенерированы!"
              : "Ожидание запуска..."}
        </p>
      </div>
    </div>
  );
};
