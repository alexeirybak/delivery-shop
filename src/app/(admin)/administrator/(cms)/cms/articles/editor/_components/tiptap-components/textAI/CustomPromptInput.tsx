import { Send } from "lucide-react";
import { CustomPromptInputProps } from "../../../../types";


export const CustomPromptInput = ({
  prompt,
  onChange,
  disabled,
}: CustomPromptInputProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Send className="w-4 h-4" />
        Свой запрос к YandexGPT:
      </h3>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Например: 'Напиши статью о искусственном интеллекте в России', 'Исправь стилистические ошибки в тексте', 'Создай план для доклада'"
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
        rows={4}
        disabled={disabled}
      />

      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-700 mb-1">
          Примеры запросов для YandexGPT:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Напиши деловое письмо на русском языке</li>
          <li>• Создай контент-план для блога о технологиях</li>
          <li>• Перефразируй текст в более официальном стиле</li>
          <li>• Подготовь тезисы для выступления</li>
        </ul>
      </div>
    </div>
  );
};
