import { PieChartSettings } from "@/store/pieChartSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { PIECHART_BASE_PROMPT } from "./pieChartBase";

export function getPieChartPrompt(settings?: PieChartSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + PIECHART_BASE_PROMPT;

  if (settings) {
    const maxSectors = settings.maxSectors || 6;

    prompt += `\n\n**ПАРАМЕТРЫ КРУГОВОЙ ДИАГРАММЫ:**\n`;
    prompt += `- Максимальное количество секторов: ${maxSectors}\n`;
    
    prompt += `\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Структура: {"data": [{"name": "категория", "value": число}, ...]}\n`;
    prompt += `3. Количество секторов: примерно ${maxSectors}\n`;
    prompt += `4. Все значения должны быть положительными числами\n`;
    prompt += `5. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `6. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `7. Данные должны быть реалистичными\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай круговую диаграмму в формате JSON\n`;
    prompt += `- Структура: {"data": [{"name": "категория", "value": число}, ...]}\n`;
    prompt += `- Количество секторов: 4-6\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}