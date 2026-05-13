import { LineChartSettings } from "@/store/lineChartSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { LINECHART_BASE_PROMPT } from "./lineChartBase";

export function getLineChartPrompt(settings?: LineChartSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + LINECHART_BASE_PROMPT;

  if (settings) {
    const maxPoints = settings.maxPoints || 10;

    prompt += `\n\n**ПАРАМЕТРЫ ЛИНЕЙНОГО ГРАФИКА:**\n`;
    prompt += `- Максимальное количество точек: ${maxPoints}\n`;

    prompt += `\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Структура: {"labels": [...], "datasets": [{"label": "...", "data": [...]}]}\n`;
    prompt += `3. Количество точек: примерно ${maxPoints}\n`;
    prompt += `4. Все значения должны быть положительными числами\n`;
    prompt += `5. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `6. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `7. Данные должны быть реалистичными\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай линейный график в формате JSON\n`;
    prompt += `- Структура: {"labels": [...], "datasets": [{"label": "...", "data": [...]}]}\n`;
    prompt += `- Количество точек: 5-10\n`;
    prompt += `- Количество наборов данных: 1-3\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}
