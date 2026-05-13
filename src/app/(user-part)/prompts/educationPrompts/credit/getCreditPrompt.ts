import { CreditSettings } from "@/store/creditSettingsStore";
import { CREDIT_BASE_PROMPT } from "./creditBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getCreditPrompt(
  settings?: CreditSettings,
): string {
  let prompt = FORMATTING_RULES + "\n\n" + CREDIT_BASE_PROMPT;
  if (settings) {
    const questionCount = parseInt(settings.questionCount || "20");

    prompt += `\n\n**ПАРАМЕТРЫ ЗАЧЕТА:**\n`;
    prompt += `- Уровень сложности: ${settings.level === "beginner" ? "Начальный" : settings.level === "intermediate" ? "Средний" : "Продвинутый"}\n`;
    prompt += `- Количество вопросов: ${questionCount}\n`;
    prompt += `- Включить ответы: ${settings.includeAnswers ? "да" : "нет"}\n`;

    if (settings.evaluationCriteria && settings.evaluationCriteria.trim()) {
      prompt += `\n**КРИТЕРИИ ОЦЕНКИ:**\n${settings.evaluationCriteria}\n`;
    }

    prompt += `\n# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. КОЛИЧЕСТВО: создай РОВНО ${questionCount} вопросов. Ни больше, ни меньше.\n`;
    prompt += `2. ОХВАТ: вопросы должны покрывать ВСЮ дисциплину.\n`;
    prompt += `3. ФОРМАТ: каждый вопрос краткий (5-10 слов).\n`;
    prompt += `4. НУМЕРАЦИЯ: вопросы от 1 до ${questionCount}.\n`;
    prompt += `# ========================================\n\n`;

    if (settings.includeAnswers) {
      prompt += `**ДЛЯ ОТВЕТОВ:** создай краткие ответы (1-2 предложения) к каждому вопросу.\n`;
      prompt += `Ответы должны быть пронумерованы соответственно вопросам.\n\n`;
    }

    prompt += `**ПРОВЕРЬ СЕБЯ:**\n`;
    prompt += `- [ ] Вопросов ровно ${questionCount}?\n`;
    prompt += `- [ ] Нумерация от 1 до ${questionCount}?\n`;
    prompt += `- [ ] Вопросы охватывают всю дисциплину?\n`;
    if (settings.includeAnswers) {
      prompt += `- [ ] Ответы соответствуют вопросам?\n`;
    }
  }

  return prompt;
}
