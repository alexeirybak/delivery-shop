import { Palette, X, AlertCircle } from "lucide-react";
import { HeaderProps } from "../../../../types";

export const Header = ({
  onTestAPI,
  onCloseClick,
  isGenerating,
}: HeaderProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center md:justify-between px-6 py-4 border-b bg-linear-to-r from-red-50 to-yellow-50">
      <div className="flex flex-wrap gap-3 justify-center md:justify-between">
        <div className="flex gap-2 justify-center md:justify-between items-center">
          <Palette className="w-7 h-7 text-red-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 text-center">
            Генератор изображений
          </h2>
        </div>

        <span className="flex items-center text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
          RU YandexART
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTestAPI}
          disabled={isGenerating}
          className="text-sm h-10 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 transition-custom cursor-pointer"
        >
          <AlertCircle className="w-4 h-4" />
          Тест API
        </button>
        <button
          onClick={onCloseClick}
          className="h-10 p-2 bg-gray-200 hover:bg-white rounded-lg ml-2 transition-custom cursor-pointer"
          disabled={isGenerating}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};
