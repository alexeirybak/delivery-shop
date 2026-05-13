import { BarchartSettings } from "@/store/barchartSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { BARCHART_BASE_PROMPT } from "./barchartBase";

export function getBarchartPrompt(settings?: BarchartSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + BARCHART_BASE_PROMPT;

  if (settings) {
    const maxBars = settings.maxBars || 10;
    const sortOrder = settings.sortOrder || "none";

    prompt += `\n\n**ПАРАМЕТРЫ СТОЛБЧАТОЙ ДИАГРАММЫ:**\n`;
    prompt += `- Максимальное количество столбцов: ${maxBars}\n`;
    prompt += `- Сортировка: ${sortOrder === "none" ? "без сортировки" : sortOrder === "asc" ? "по возрастанию" : "по убыванию"}\n`;
    
    prompt += `\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Структура: {"labels": [...], "datasets": [{"label": "...", "data": [...]}]}\n`;
    prompt += `3. Количество столбцов: примерно ${maxBars}\n`;
    if (sortOrder !== "none") {
      prompt += `4. Отсортируй данные: ${sortOrder === "asc" ? "по возрастанию значений" : "по убыванию значений"}\n`;
    }
    prompt += `5. Все значения должны быть положительными числами\n`;
    prompt += `6. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `7. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `8. Данные должны быть реалистичными\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай столбчатую диаграмму в формате JSON\n`;
    prompt += `- Структура: {"labels": [...], "datasets": [{"label": "...", "data": [...]}]}\n`;
    prompt += `- Количество столбцов: 5-10\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}