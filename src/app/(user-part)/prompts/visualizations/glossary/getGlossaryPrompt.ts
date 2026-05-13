import { GlossarySettings } from "@/store/glossarySettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { GLOSSARY_BASE_PROMPT } from "./glossaryBase";

export function getGlossaryPrompt(settings?: GlossarySettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + GLOSSARY_BASE_PROMPT;

  if (settings) {
    const termCount = settings.termCount || 15;
    const includeExamples = settings.includeExamples;
    const includeRelatedTerms = settings.includeRelatedTerms;
    const detailLevel = settings.detailLevel || "compact";

    prompt += `\n\n**ПАРАМЕТРЫ ГЛОССАРИЯ:**\n`;
    prompt += `- Количество терминов: ${termCount}\n`;
    prompt += `- Детализация: ${detailLevel === "compact" ? "компактный (только термин и определение)" : "подробный (+ примеры, связанные термины, теги)"}\n`;
    prompt += `- Включение примеров: ${includeExamples ? "да" : "нет"}\n`;
    prompt += `- Включение связанных терминов: ${includeRelatedTerms ? "да" : "нет"}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Создай ровно ${termCount} терминов\n`;
    prompt += `2. Термины должны быть отсортированы по алфавиту\n`;
    prompt += `3. Определения должны быть понятными\n`;

    if (detailLevel === "compact") {
      prompt += `4. Используй компактный формат: только термин и определение\n`;
    } else {
      prompt += `4. Используй подробный формат:\n`;
      prompt += `   - Добавляй примеры использования\n`;
      if (includeExamples) {
        prompt += `   - ОБЯЗАТЕЛЬНО добавляй примеры к каждому термину\n`;
      }
      if (includeRelatedTerms) {
        prompt += `   - ОБЯЗАТЕЛЬНО добавляй связанные термины (2-5)\n`;
      }
      prompt += `   - Добавляй теги для категоризации (2-4)\n`;
    }

    prompt += `5. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `6. НЕ оборачивай JSON в Markdown-блоки (не используй \`\`\`json)\n`;
    prompt += `7. title глоссария должен соответствовать теме\n`;
    prompt += `8. ВАЖНО: каждый термин должен быть полезным для изучения темы\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай глоссарий в формате JSON\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}