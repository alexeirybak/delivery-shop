import { Send } from "lucide-react";
import { CustomPromptInputProps } from "../../../types";
import "../../../styles/custom-prompt-input.css";

export const CustomPromptInput = ({
  prompt,
  onChange,
  disabled,
}: CustomPromptInputProps) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="custom-prompt-section">
      <div className="custom-prompt-header">
        <Send />
        <h3>Запрос для генерации:</h3>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Например: "Создай задание на отработку темы...", "Составь упражнения для проверки знаний...", "Напиши вопросы для самостоятельной работы..."'
        className="custom-prompt-textarea"
        rows={4}
        disabled={disabled}
      />

      <div className="custom-prompt-examples">
        <p className="custom-prompt-examples-title">
          Примеры запросов для рабочей тетради:
        </p>
        <ul
          className="custom-prompt-examples-list"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          onDragStart={handleDragStart}
        >
          <li>Создай задания на закрепление темы &quot;... &quot;</li>
          <li>
            Составь упражнения для проверки знаний по разделу &quot;... &quot;
          </li>
          <li>Напиши вопросы для самостоятельной работы</li>
          <li>Разработай практические задания по теме &quot;... &quot;</li>
          <li>Создай тестовые вопросы для самопроверки</li>
          <li>Составь кроссворд по ключевым терминам темы</li>
          <li>Напиши задачи на применение изученного материала</li>
          <li>Разработай творческое задание по теме</li>
        </ul>
      </div>
    </div>
  );
};
