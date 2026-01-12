import { AlertCircle } from "lucide-react";
import { ErrorPanelProps } from "../../../../types";

export const ErrorPanel = ({ error }: ErrorPanelProps) => {
  return (
    <div className="mb-6 p-6 bg-red-50 rounded-xl border border-red-200">
      <div className="flex items-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-600" />
        <div>
          <p className="text-xl font-bold text-red-800">Ошибка YandexART</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <p className="text-xs text-red-500 mt-2">
            Проверьте настройки API и повторите попытку
          </p>
        </div>
      </div>
    </div>
  );
};
