import { WritingSettings } from "@/store/writingSettingsStore";
import { TEXTBOOK_BASE_PROMPT } from "./textbookBase";

export function getTextbookPrompt(settings?: WritingSettings): string {
  let prompt = TEXTBOOK_BASE_PROMPT;

  if (settings) {
    prompt += `\n\n**КОНТЕКСТ УЧЕБНИКА:**\n`;
    prompt += `- Название: ${settings.title || "не указано"}\n`;
    prompt += `- Предмет: ${settings.subject || "не указан"}\n`;

    if (settings.educationLevel === "school") {
      prompt += `- Целевая аудитория: ${settings.grade} класс\n`;
    } else if (settings.educationLevel === "spo") {
      prompt += `- Целевая аудитория: ${settings.courseYear} курс СПО\n`;
    } else if (settings.educationLevel === "university") {
      prompt += `- Целевая аудитория: ${settings.courseYear} курс вуза\n`;
    }
  }

  return prompt;
}
