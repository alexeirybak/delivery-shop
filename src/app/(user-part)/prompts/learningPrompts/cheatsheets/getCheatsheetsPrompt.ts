import { CheatsheetsSettings } from "@/store/cheatsheetsSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { CHEATSHEETS_BASE_PROMPT } from "./cheatsheetsBase";

export function getCheatsheetsPrompt(settings?: CheatsheetsSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + CHEATSHEETS_BASE_PROMPT;

  if (settings) {
    const format = settings.format || "compact";
    const includeExamples = settings.includeExamples ?? true;
    const includeFormulas = settings.includeFormulas ?? true;
    const maxItems = settings.maxItems || 10;

    const formatDescriptions = {
      compact:
        "Компактный формат — только ключевые пункты, без подробных пояснений, формулировки максимально сжатые",
      detailed:
        "Подробный формат — ключевые пункты с краткими пояснениями, добавление примеров",
    };

    prompt += `\n\n**ПАРАМЕТРЫ ШПАРГАЛКИ:**\n`;
    prompt += `- Формат: ${formatDescriptions[format]}\n`;
    prompt += `- Количество пунктов: примерно ${maxItems}\n`;
    prompt += `- Включение примеров: ${includeExamples ? "да" : "нет"}\n`;
    prompt += `- Включение формул: ${includeFormulas ? "да" : "нет"}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;

    prompt += `1. Создай шпаргалку\n`;
    prompt += `2. Количество пунктов: примерно ${maxItems}\n`;

    if (format === "compact") {
      prompt += `3. Формат: компактный — только суть, минимум текста, ключевые слова\n`;
    } else {
      prompt += `3. Формат: подробный — каждый пункт с кратким пояснением\n`;
    }

    prompt += `4. Используй маркированные списки для удобства восприятия\n`;
    prompt += `5. Выделяй ключевые термины и понятия\n`;

    if (includeFormulas) {
      prompt += `6. ОБЯЗАТЕЛЬНО включи основные формулы, определения и законы\n`;
      prompt += `7. Для формул используй LaTeX-формат:\n`;
      prompt += `   - Строчные формулы: $формула$\n`;
      prompt += `   - Блочные формулы: $$формула$$\n`;
    }

    if (includeExamples) {
      prompt += `8. ОБЯЗАТЕЛЬНО добавь примеры для иллюстрации ключевых понятий\n`;
    }

    prompt += `9. Информация должна быть структурированной и логичной\n`;
    prompt += `10. Избегай воды и лишних подробностей\n`;
    prompt += `11. Шпаргалка должна быть удобной для быстрого повторения\n`;
    prompt += `12. ВЕРНИ ТОЛЬКО ШПАРГАЛКУ, БЕЗ ЛИШНИХ ПОЯСНЕНИЙ\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай шпаргалку в формате связного текста\n`;
    prompt += `- Основные понятия, формулы, определения\n`;
    prompt += `- Для формул используй LaTeX-формат: $формула$ или $$формула$$\n`;
    prompt += `- Четкая структура, ключевые слова\n`;
    prompt += `- Верни ТОЛЬКО шпаргалку, без пояснений\n`;
  }

  return prompt;
}
