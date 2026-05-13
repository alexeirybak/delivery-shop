import { FlashcardsSettings } from "@/store/flashcardsSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { FLASHCARDS_BASE_PROMPT } from "./flashcardsBase";

export function getFlashcardsPrompt(settings?: FlashcardsSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + FLASHCARDS_BASE_PROMPT;

  if (settings) {
    const cardCount = settings.cardCount || 10;
    const difficulty = settings.difficulty || "medium";
    const answerMode = settings.answerMode || "short";
    const includeExamples = settings.includeExamples || false;

    prompt += `\n\n**ПАРАМЕТРЫ КАРТОЧЕК:**\n`;
    prompt += `- Количество карточек: ${cardCount}\n`;
    prompt += `- Уровень сложности: ${difficulty === "easy" ? "легкий (базовые понятия)" : difficulty === "medium" ? "средний (ключевые концепты)" : "сложный (детальный разбор)"}\n`;
    prompt += `- Детализация ответов: ${answerMode === "short" ? "краткий (один абзац)" : "подробный (2-3 абзаца)"}\n`;
    prompt += `- Включение примеров: ${includeExamples ? "да" : "нет"}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Создай ровно ${cardCount} карточек\n`;
    prompt += `2. Уровень сложности "${difficulty}": `;
    if (difficulty === "easy") {
      prompt += `вопросы по основным определениям и простым фактам\n`;
    } else if (difficulty === "medium") {
      prompt += `вопросы на понимание концепций и причинно-следственных связей\n`;
    } else {
      prompt += `вопросы на анализ, синтез и применение знаний в новых ситуациях\n`;
    }

    if (answerMode === "short") {
      prompt += `3. Ответы должны быть краткими (2-4 предложения)\n`;
    } else {
      prompt += `3. Ответы должны быть развернутыми (до 6-8 предложений)\n`;
    }

    if (includeExamples) {
      prompt += `4. ОБЯЗАТЕЛЬНО добавляй примеры к ответам\n`;
    }

    prompt += `5. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `6. НЕ оборачивай JSON в Markdown-блоки (не используй \`\`\`json)\n`;
    prompt += `7. ВАЖНО: каждая карточка должна быть полезной для запоминания\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай колоду карточек в формате JSON\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}
