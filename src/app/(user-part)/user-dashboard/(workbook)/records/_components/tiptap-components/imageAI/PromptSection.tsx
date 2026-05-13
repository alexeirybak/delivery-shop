import { PromptSectionProps } from "../../../types";
import "../../../styles/prompt-section.css";

export const PromptSection = ({
  prompt,
  onPromptChange,
  isGenerating,
}: PromptSectionProps) => {
  const examplePrompts = [
    "Космический пейзаж с туманностями и звездами, фантастический арт",
    "Кот в сапогах, иллюстрация в стиле средневековой миниатюры",
    "Девушка с книгой в осеннем парке, фотореализм",
    "Дракон, парящий над средневековым замком, цифровая живопись",
    "Подводный мир с кораллами и рыбками, яркие цвета",
    "Портрет мудрой совы в очках, акварельный стиль",
    "Футуристический город с летающими машинами, киберпанк",
    "Чайная церемония в японском саду, стиль аниме",
  ];

  return (
    <div className="prompt-section">
      <label className="prompt-label">Опишите изображение для генерации:</label>
      <textarea
        value={prompt}
        onChange={onPromptChange}
        placeholder='Например: "Иллюстрация к басне Крылова, акварель" или "Древний Рим, историческая реконструкция"'
        className="prompt-textarea"
        rows={3}
        disabled={isGenerating}
      />
      <div className="prompt-examples">
        <p className="prompt-examples-title">
          Примеры запросов для генерации изображений:
        </p>
        <p className="prompt-examples-note">
          Внимание! Генератор создает только художественные иллюстрации, фотографии и
          цифровую живопись. Для создания схем, диаграмм, графиков, таблиц и
          текстовых элементов используйте другие инструменты.
        </p>
        <ul className="prompt-examples-list">
          {examplePrompts.map((example, index) => (
            <li key={index}>{example}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};