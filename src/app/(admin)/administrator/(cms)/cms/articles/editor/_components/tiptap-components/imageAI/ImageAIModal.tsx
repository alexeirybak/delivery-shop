import {
  X,
  Palette,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Clock,
  Check,
} from "lucide-react";
import { StatusPanel } from "./StatusPanel";
import ResultPanel from "./ResultPanel";
import { formatTime } from "../../../../utils/formatTime";
import { SettingsPanel } from "./SettingsPanel";
import { useRef } from "react";
import { ImageAIModalProps } from "../../../../types";

export const ImageAIModal = ({
  prompt,
  generation,
  selectedAspect,
  selectedStyle,
  apiInfo,
  elapsedSeconds,
  onPromptChange,
  onAspectChange,
  onStyleChange,
  onTestAPI,
  onDownload,
  onInsertToEditor,
  onGenerateImage,
  onModalClick,
  onCloseClick,
  onSettingsButtonClick,
  onStyleButtonClick,
}: ImageAIModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="fixed inset-0 bg-blue-950 flex items-center justify-center z-10000 p-4"
      onClick={onCloseClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={onModalClick}
      >
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-red-50 to-yellow-50">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Palette className="w-7 h-7 text-red-600" />
              <span>Генератор изображений</span>
              <span className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                🇷🇺 YandexART
              </span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Российская нейросеть для создания изображений по текстовому
              описанию
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onTestAPI}
              disabled={
                generation.status === "generating" ||
                generation.status === "processing"
              }
              className="text-sm px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 duration-300 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              Тест API
            </button>
            <button
              onClick={onCloseClick}
              className="p-2 hover:bg-white rounded-lg ml-2 duration-300 cursor-pointer"
              disabled={
                generation.status === "generating" ||
                generation.status === "processing"
              }
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Информация о подключении */}
          {apiInfo && (
            <div
              className={`mb-4 p-3 rounded-lg border ${
                // Красный - для ошибок
                apiInfo.includes("Ошибка") ||
                apiInfo.includes("ошибка") ||
                apiInfo.toLowerCase().includes("error") ||
                apiInfo.includes("не удалось")
                  ? "bg-red-50 border-red-200 text-red-800"
                  : // Зеленый - для успешных сообщений
                    apiInfo.includes("работает") ||
                      apiInfo.includes("Запрос принят") ||
                      apiInfo.includes("подключен")
                    ? "bg-green-50 border-green-200 text-green-800"
                    : // Синий - для информационных сообщений
                      "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              <div className="text-sm whitespace-pre-line">{apiInfo}</div>
            </div>
          )}

          {/* Промпт */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Что вы хотите увидеть?
            </label>
            <textarea
              value={prompt}
              onChange={onPromptChange}
              placeholder="Детально опишите изображение..."
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              rows={3}
              disabled={
                generation.status === "generating" ||
                generation.status === "processing"
              }
            />
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-1">
                Примеры запросов:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Закат над горами, фотореалистично</li>
                <li>• Кот в космическом костюме, мультяшный стиль</li>
                <li>• Портрет девушки в стиле импрессионизма</li>
              </ul>
            </div>
          </div>

          <SettingsPanel
            selectedAspect={selectedAspect}
            selectedStyle={selectedStyle}
            onAspectChange={onAspectChange}
            onStyleChange={onStyleChange}
            disabled={
              generation.status === "generating" ||
              generation.status === "processing"
            }
            onAspectButtonClick={onSettingsButtonClick}
            onStyleButtonClick={onStyleButtonClick}
          />

          {(generation.status === "generating" ||
            generation.status === "processing") && (
            <StatusPanel
              status={generation.status}
              elapsedSeconds={elapsedSeconds}
              operationId={generation.operationId}
            />
          )}

          {generation.status === "completed" && generation.imageUrl && (
            <ResultPanel
              imageUrl={generation.imageUrl}
              prompt={prompt}
              selectedStyle={selectedStyle}
              selectedAspect={selectedAspect}
              elapsedSeconds={elapsedSeconds}
              onDownload={onDownload}
              onInsertToEditor={onInsertToEditor}
            />
          )}

          {/* Ошибка */}
          {generation.status === "failed" && generation.error && (
            <div className="mb-6 p-6 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-600" />
                <div>
                  <p className="text-xl font-bold text-red-800">
                    Ошибка YandexART
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    {generation.error}
                  </p>
                  <p className="text-xs text-red-500 mt-2">
                    Проверьте настройки API и повторите попытку
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {generation.status === "idle" && "Введите описание для генерации"}
              {generation.status === "generating" && "Запуск YandexART..."}
              {generation.status === "processing" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>YandexART: {formatTime(elapsedSeconds)}</span>
                </div>
              )}
              {generation.status === "completed" && (
                <span className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  Готово!
                </span>
              )}
              {generation.status === "failed" && (
                <span className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  Ошибка
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCloseClick}
                disabled={
                  generation.status === "generating" ||
                  generation.status === "processing"
                }
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium duration-300 cursor-pointer"
              >
                {generation.status === "completed" ? "Закрыть" : "Отмена"}
              </button>

              {generation.status === "completed" ? (
                <button
                  onClick={onInsertToEditor}
                  className="px-6 py-2.5 bg-linear-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 font-medium flex items-center gap-2 duration-300 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Вставить в документ
                </button>
              ) : (
                <button
                  onClick={onGenerateImage}
                  disabled={
                    generation.status === "generating" ||
                    generation.status === "processing" ||
                    !prompt.trim()
                  }
                  className="px-6 py-2.5 bg-linear-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 duration-300 cursor-pointer"
                >
                  {generation.status === "generating" ||
                  generation.status === "processing" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      YandexART работает...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Создать изображение
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
