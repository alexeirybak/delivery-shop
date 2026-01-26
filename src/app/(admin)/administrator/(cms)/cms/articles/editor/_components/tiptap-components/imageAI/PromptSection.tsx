import { PromptSectionProps } from "../../../../types";

export const PromptSection = ({
  prompt,
  onPromptChange,
  isGenerating,
}: PromptSectionProps) => {
  const examplePrompts = [
    "Аппетитная пицца с расплавленным сыром, макросъемка",
    "Свежие фрукты на деревянном столе, естественное освещение",
    "Ароматный кофе с пенкой, минималистичный стиль",
    "Сочный стейк с овощами гриль, фотореалистично",
    "Красочный салат в стеклянной миске, яркие цвета",
    "Домашняя выпечка с корицей, уютная атмосфера",
    "Мороженое с ягодами, летнее настроение",
    "Суши на черной тарелке, элегантная подача",
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Что вы хотите увидеть?
      </label>
      <textarea
        value={prompt}
        onChange={onPromptChange}
        placeholder="Детально опишите изображение..."
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        rows={3}
        disabled={isGenerating}
      />
      <div className="hidden md:block mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-700 mb-1">
          Примеры запросов:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          {examplePrompts.map((example, index) => (
            <li key={index}>• {example}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
