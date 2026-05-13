import { RadarChartSettings } from "@/store/radarChartSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { RADARCHART_BASE_PROMPT } from "./radarChartBase";

export function getRadarChartPrompt(settings?: RadarChartSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + RADARCHART_BASE_PROMPT;

  if (settings) {
    const maxAxes = settings.maxAxes || 6;

    prompt += `\n\n**ПАРАМЕТРЫ ЛЕПЕСТКОВОЙ ДИАГРАММЫ:**\n`;
    prompt += `- Максимальное количество осей: ${maxAxes}\n`;

    prompt += `\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Структура: {"labels": [...], "datasets": [{"label": "...", "data": [...]}]}\n`;
    prompt += `3. Количество осей: примерно ${maxAxes}\n`;
    prompt += `4. Все значения должны быть в диапазоне 0-100\n`;
    prompt += `5. Количество значений в data должно совпадать с количеством labels\n`;
    prompt += `6. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `7. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `8. Данные должны быть реалистичными\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай лепестковую диаграмму в формате JSON\n`;
    prompt += `- Структура: {"labels": [...], "datasets": [{"label": "...", "data": [...]}]}\n`;
    prompt += `- Количество осей: 4-6\n`;
    prompt += `- Количество наборов данных: 1-2\n`;
    prompt += `- Значения в диапазоне 0-100\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}
