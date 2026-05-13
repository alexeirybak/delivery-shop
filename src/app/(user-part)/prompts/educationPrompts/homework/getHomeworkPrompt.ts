import { HomeworkSettings } from "@/store/homeworkSettingsStore";
import { HOMEWORK_BASE_PROMPT } from "./homeworkBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getHomeworkPrompt(settings?: HomeworkSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + HOMEWORK_BASE_PROMPT;
  if (settings) {
    prompt += "\n\n**ПАРАМЕТРЫ ПРОВЕРКИ ОТ УЧИТЕЛЯ:**\n";

    if (settings.subject) {
      prompt += `- Предмет: ${settings.subject}\n`;
    }

    if (settings.grade) {
      const gradeMap: Record<string, string> = {
        "1": "1 класс (7-8 лет)",
        "2": "2 класс (8-9 лет)",
        "3": "3 класс (9-10 лет)",
        "4": "4 класс (10-11 лет)",
        "5": "5 класс (11-12 лет)",
        "6": "6 класс (12-13 лет)",
        "7": "7 класс (13-14 лет)",
        "8": "8 класс (14-15 лет)",
        "9": "9 класс (15-16 лет)",
        "10": "10 класс (16-17 лет)",
        "11": "11 класс (17-18 лет)",
      };
      prompt += `- Класс: ${gradeMap[settings.grade] || settings.grade + " класс"}\n`;
      prompt += `- Уровень сложности объяснений: для ${settings.grade} класса\n`;
    }

    if (settings.strictness) {
      const strictnessMap: Record<string, string> = {
        strict: "Строгий режим: отмечай даже мелкие ошибки",
        normal: "Средний режим: отмечай только существенные ошибки",
        lenient:
          "Лояльный режим: акцент на понимании материала, мелкие погрешности не считай ошибками",
      };
      prompt += `- Строгость проверки: ${strictnessMap[settings.strictness]}\n`;
    }

    if (settings.includeExplanation) {
      prompt += `- Пояснение ошибок: ДА — подробно объясняй каждую ошибку\n`;
    } else {
      prompt += `- Пояснение ошибок: НЕТ — только указывай на ошибки без объяснений\n`;
    }
  }

  prompt += `\n\n**ВАЖНЫЕ ПРАВИЛА ПРОВЕРКИ:**\n`;
  prompt += `1. Учитывай класс ученика при объяснении ошибок\n`;
  prompt += `2. Давай чёткие правильные ответы на каждую ошибку\n`;
  prompt += `3. Оценка должна соответствовать уровню строгости\n`;
  prompt += `4. Используй нейтральный, профессиональный тон\n`;

  return prompt;
}
