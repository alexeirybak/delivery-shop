import { TestSettings } from "@/app/(user-part)/user-dashboard/writing/types";
import { TEST_BASE_PROMPT } from "./testBase";

export function getTestPrompt(settings?: TestSettings): string {
  let prompt = TEST_BASE_PROMPT;

  if (settings) {
    prompt += `\n\n**КОНТЕКСТ КОНТРОЛЬНОЙ РАБОТЫ:**\n`;
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

  return prompt;
}