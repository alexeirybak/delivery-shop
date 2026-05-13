import { ComparisonTableSettings } from "@/store/comparisonTableSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { COMPARISON_TABLE_BASE_PROMPT } from "./comparisonTableBase";

export function getComparisonTablePrompt(
  settings?: ComparisonTableSettings,
): string {
  let prompt = FORMATTING_RULES + "\n\n" + COMPARISON_TABLE_BASE_PROMPT;

  if (settings) {
    const maxRows = settings.maxRows || 10;
    const maxColumns = settings.maxColumns || 6;

    prompt += `\n\n**ПАРАМЕТРЫ СРАВНИТЕЛЬНОЙ ТАБЛИЦЫ:**\n`;
    prompt += `- Максимальное количество строк: ${maxRows}\n`;
    prompt += `- Максимальное количество столбцов: ${maxColumns}\n`;

    prompt += `\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Структура: {"headers": [...], "rows": [...]}\n`;
    prompt += `3. Количество строк: примерно ${maxRows}\n`;
    prompt += `4. Количество столбцов: примерно ${maxColumns}\n`;
    prompt += `5. Первый столбец — критерии сравнения\n`;
    prompt += `6. Заголовки должны быть четкими и понятными\n`;
    prompt += `7. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `8. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `9. Данные должны быть реалистичными\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай сравнительную таблицу в формате JSON\n`;
    prompt += `- Структура: {"headers": [...], "rows": [...]}\n`;
    prompt += `- Количество строк: 5-10\n`;
    prompt += `- Количество столбцов: 3-6\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}
