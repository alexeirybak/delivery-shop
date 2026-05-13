import { RoleplaySettings } from "@/store/roleplaySettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { ROLEPLAY_BASE_PROMPT } from "./roleplayBase";

export function getRoleplayPrompt(settings?: RoleplaySettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + ROLEPLAY_BASE_PROMPT;

  if (settings) {
    const difficulty = settings.difficulty || "intermediate";
    const maxChoices = settings.maxChoices || 4;
    const includeMetrics = settings.includeMetrics ?? true;
    const includeHistory = settings.includeHistory ?? true;
    const showConsequences = settings.showConsequences ?? true;

    prompt += `\n\n**ПАРАМЕТРЫ РОЛЕВОЙ ИГРЫ:**\n`;
    prompt += `- Уровень сложности: ${difficulty === "beginner" ? "новичок (простые ситуации, понятные последствия)" : difficulty === "intermediate" ? "средний (реалистичные сценарии)" : "эксперт (сложные многовариантные ситуации)"}\n`;
    prompt += `- Количество вариантов выбора: ${maxChoices}\n`;
    prompt += `- Включение метрик: ${includeMetrics ? "да" : "нет"}\n`;
    prompt += `- Включение истории решений: ${includeHistory ? "да" : "нет"}\n`;
    prompt += `- Показывать последствия: ${showConsequences ? "да" : "нет"}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Создай реалистичный сценарий\n`;
    prompt += `2. Роль пользователя должна соответствовать контексту\n`;
    prompt += `3. Ситуация должна быть четко описана\n`;
    prompt += `4. Создай ровно ${maxChoices} вариантов действий\n`;
    prompt += `5. Уровень сложности "${difficulty}": `;

    if (difficulty === "beginner") {
      prompt += `последствия должны быть очевидными, варианты выбора — контрастными\n`;
    } else if (difficulty === "intermediate") {
      prompt += `последствия могут быть неочевидными, варианты выбора — нюансированными\n`;
    } else {
      prompt += `последствия должны быть многовариантными, возможны неожиданные результаты\n`;
    }

    if (includeMetrics) {
      prompt += `6. Обязательно включи метрики, соответствующие сценарию:\n`;
      prompt += `   - Для бизнес-сценариев: budget, time, morale, reputation\n`;
      prompt += `   - Для медицинских: health, time, morale\n`;
      prompt += `   - Для образовательных: knowledge, time, morale\n`;
      prompt += `   - Начальные значения: 50-100\n`;
    } else {
      prompt += `6. НЕ включай метрики в JSON\n`;
    }

    if (includeHistory) {
      prompt += `7. Сохраняй историю всех выборов пользователя\n`;
    }

    if (showConsequences) {
      prompt += `8. Детально описывай последствия каждого выбора\n`;
    }

    prompt += `9. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `10. НЕ оборачивай JSON в Markdown-блоки (не используй \`\`\`json)\n`;
    prompt += `11. ВАЖНО: игра должна быть интересной и обучающей\n`;
    prompt += `12. Последствия должны быть логичными и соответствовать выбору\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай ро<- ЛЕВУЮ игру в формате JSON\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}
