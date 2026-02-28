import { RefreshCw, Send } from "lucide-react";
import { FooterStatusProps } from "../../../../types";

export const FooterStatus = ({
  selectedText,
  aiStatus,
  onCancel,
  onSubmit,
  isGenerating,
  isSubmitDisabled,
  errorDetails,
}: FooterStatusProps) => {
  return (
    <div className="border-t p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center mb-4 gap-4">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Выделенный текст:</span>
          <span className="ml-2">
            {selectedText === ""
              ? "Нет выделения"
              : `${selectedText.substring(0, 100)}...`}
          </span>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap gap-3">
          <button
            onClick={onCancel}
            disabled={isGenerating}
            className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-custom cursor-pointer"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isGenerating || isSubmitDisabled}
            className="flex-1 px-5 py-2.5 bg-linear-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg flex items-center gap-2 transition-custom cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                YandexGPT генерирует...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 shrink-0" />
                Запросить у YandexGPT
              </>
            )}
          </button>
        </div>
      </div>

      {aiStatus !== "idle" && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            aiStatus === "loading"
              ? "bg-yellow-100 text-yellow-700"
              : aiStatus === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {aiStatus === "loading" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>YandexGPT обрабатывает запрос...</span>
              </>
            ) : aiStatus === "success" ? (
              <>
                <span className="text-green-600">✓</span>
                <span>Текст успешно сгенерирован!</span>
              </>
            ) : (
              <>
                <span className="text-red-600">✗</span>
                <span>Ошибка YandexGPT</span>
              </>
            )}
          </div>
          {errorDetails && (
            <div className="mt-2 text-xs font-normal">{errorDetails}</div>
          )}
        </div>
      )}
    </div>
  );
};
