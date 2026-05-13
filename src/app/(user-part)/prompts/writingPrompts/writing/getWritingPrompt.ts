import { WritingSettings } from "@/store/writingSettingsStore";
import { WRITING_BASE_PROMPT } from "./writingBase";
import { getGenreName } from "./getGenreName";

export function getWritingPrompt(
  mode: "textbooks" | "coursework" | "report" | "thesis",
  settings?: WritingSettings,
): string {
  let prompt = WRITING_BASE_PROMPT;

  if (settings) {
    prompt += `\n\n**КОНТЕКСТ РАБОТЫ:**\n`;
    prompt += `- Жанр: ${getGenreName(mode)}\n`;
    prompt += `- Предмет: ${settings.subject || "не указан"}\n`;
    prompt += `- Тема: ${settings.title || "не указана"}\n`;

    if (settings.educationLevel === "school") {
      prompt += `- Уровень: школа, ${settings.grade} класс\n`;
    } else if (settings.educationLevel === "spo") {
      prompt += `- Уровень: среднее профессиональное образование, ${settings.courseYear} курс\n`;
    } else if (settings.educationLevel === "university") {
      prompt += `- Уровень: высшее образование, ${settings.courseYear} курс\n`;
    }
  }

  prompt += `\n\n**ПРАВИЛА ДЛЯ ВВЕДЕНИЯ И ЗАКЛЮЧЕНИЯ:**\n`;
  prompt += `- Введение и заключение НЕ требуют списка литературы и ссылок в тексте\n`;
  prompt += `- Введение должно содержать: актуальность, цель, задачи\n`;
  prompt += `- Заключение должно содержать: основные выводы по работе\n`;

  switch (mode) {
    case "coursework":
      prompt += `\n\n**ТИП РАБОТЫ: КУРСОВАЯ РАБОТА**\n`;
      prompt += `- Стиль: научно-исследовательский\n`;
      prompt += `- В основных главах делай ссылки на источники в формате [1], [2] и добавляй список литературы в конце главы\n`;
      prompt += `- Включи анализ и выводы\n`;
      break;

    case "report":
      prompt += `\n\n**ТИП РАБОТЫ: РЕФЕРАТ**\n`;
      prompt += `- Стиль: обзорный, информативный\n`;
      prompt += `- Ссылки на источники не требуются\n`;
      prompt += `- Излагай содержание источников без критического анализа\n`;
      break;

    case "thesis":
      prompt += `\n\n**ТИП РАБОТЫ: ВЫПУСКНАЯ КВАЛИФИКАЦИОННАЯ РАБОТА (ВКР)**\n`;
      prompt += `- Стиль: строго научный, академический\n`;
      prompt += `- В основных главах делай ссылки на источники в формате [1], [2] и добавляй список литературы в конце главы\n`;
      prompt += `- Обязательно: методология, анализ, рекомендации\n`;
      break;
  }

  return prompt;
}


