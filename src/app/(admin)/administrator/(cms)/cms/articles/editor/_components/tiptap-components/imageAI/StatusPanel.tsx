import { RefreshCw, PlayCircle, Clock } from 'lucide-react';
import { StatusPanelProps } from '../../../../types';
import { formatTime } from '../../../../utils/formatTime';

export const StatusPanel = ({ status, elapsedSeconds, operationId }: StatusPanelProps) => {

  return (
    <div className="mb-6 p-6 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="relative">
          <RefreshCw className="w-12 h-12 text-yellow-600 animate-spin" />
          <PlayCircle className="w-6 h-6 text-yellow-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-yellow-800">
            {status === "generating"
              ? "Запуск YandexART..."
              : "YandexART генерирует..."}
          </p>
          <p className="text-sm text-yellow-600 mt-1 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Прошло: {formatTime(elapsedSeconds)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-yellow-500 to-orange-500 transition-all duration-300"
            style={{
              width: `${Math.min(elapsedSeconds * 3, 100)}%`,
            }}
          />
        </div>

        {operationId && (
          <div className="text-xs text-yellow-600 text-center mt-2">
            ID операции: {operationId.substring(0, 30)}
            ...
          </div>
        )}

        <p className="text-sm text-gray-600 text-center">
          YandexART создает изображение. Это может занять до минуты.
        </p>
      </div>
    </div>
  );
};