import { TimelineSettings } from "@/store/timelineSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { TIMELINE_BASE_PROMPT } from "./timelineBase";

export function getTimelinePrompt(settings?: TimelineSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + TIMELINE_BASE_PROMPT;

  if (settings) {
    const maxEvents = settings.maxEvents || 15;
    const sortOrder = settings.sortOrder || "asc";
    const dateFormat = settings.dateFormat || "full";

    const dateFormatMap = {
      full: "ГГГГ-ММ-ДД (например, 1917-10-25)",
      monthYear: "ММ.ГГГГ (например, 10.1917) или просто ГГГГ (например, 1917)",
      year: "ГГГГ (только год, например, 1917)",
    };

    prompt += `\n\n**ПАРАМЕТРЫ ХРОНОЛОГИИ:**\n`;
    prompt += `- Максимальное количество событий: ${maxEvents}\n`;
    prompt += `- Порядок сортировки: ${sortOrder === "asc" ? "от старых к новым" : "от новых к старым"}\n`;
    prompt += `- Формат даты: ${dateFormatMap[dateFormat]}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Структура: {"title": "...", "description": "...", "events": [...]}\n`;
    prompt += `3. Количество событий: примерно ${maxEvents}\n`;
    prompt += `4. Отсортируй события: ${sortOrder === "asc" ? "от самых ранних к поздним" : "от самых поздних к ранним"}\n`;
    prompt += `5. Формат даты: ${dateFormatMap[dateFormat]}\n`;
    prompt += `6. Добавь уникальный id для каждого события\n`;
    prompt += `7. Поле "description" - обязательно для каждого события\n`;
    prompt += `8. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `9. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `10. Даты должны соответствовать историческим реалиям или логике темы\n`;
    prompt += `11. События должны быть информативными и содержательными\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай хронологию в формате JSON\n`;
    prompt += `- Структура: {"title": "...", "description": "...", "events": [...]}\n`;
    prompt += `- Количество событий: 5-10\n`;
    prompt += `- Каждое событие: id, date, title, description\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}
