import { PromptInputProps } from "../../../../types";

export const PromptInput = ({
  prompt,
  onChange,
  disabled,
}: PromptInputProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Что вы хотите увидеть?
      </label>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Детально опишите изображение..."
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
        rows={3}
        disabled={disabled}
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
  );
};
