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
        Персональный запрос для YandexGPT:
      </h3>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Например: 'Напиши статью о пользе свежих овощей', 'Создай рецепт быстрого ужина', 'Опиши преимущества разных сортов сыра', 'Составь гид по выбору качественных продуктов'"
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        rows={4}
        disabled={disabled}
      />

      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-700 mb-1">
          Примеры запросов для блога о продуктах питания:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Напиши статью о пользе свежих овощей для здоровья</li>
          <li>• Сравни разные сорта сыра и их использование в кулинарии</li>
          <li>• Составь гид по выбору качественного мяса</li>
          <li>• Опиши преимущества разных видов растительного масла</li>
          <li>• Создай рецепт быстрого и полезного ужина</li>
          <li>• Подготовь сравнение разных видов муки для выпечки</li>
          <li>• Напиши статью о правильном хранении продуктов</li>
          <li>• Составь список продуктов для здорового завтрака</li>
          <li>• Опиши как выбрать качественные морепродукты</li>
          <li>• Создай статью о пользе разных видов круп</li>
        </ul>
      </div>
    </div>
  );
};