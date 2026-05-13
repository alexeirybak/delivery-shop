import { RoadmapSettings } from "@/store/roadmapSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { ROADMAP_BASE_PROMPT } from "./roadmapBase";

export function getRoadmapPrompt(settings?: RoadmapSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + ROADMAP_BASE_PROMPT;

  if (settings) {
    const maxPhases = settings.maxPhases || 6;
    const maxTasks = settings.maxTasks || 4;

    prompt += `\n\n**ПАРАМЕТРЫ ДОРОЖНОЙ КАРТЫ:**\n`;
    prompt += `- Максимальное количество этапов: ${maxPhases}\n`;
    prompt += `- Максимальное количество задач на этап: ${maxTasks}\n`;

    prompt += `\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Структура: {"phases": [{"name": "...", "tasks": [...], "duration": "..."}]}\n`;
    prompt += `3. Количество этапов: примерно ${maxPhases}\n`;
    prompt += `4. Количество задач на этап: примерно ${maxTasks}\n`;
    prompt += `5. Этапы должны идти в хронологическом порядке\n`;
    prompt += `6. Добавляй реалистичные сроки выполнения (duration)\n`;
    prompt += `7. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `8. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `9. Данные должны быть реалистичными\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай дорожную карту в формате JSON\n`;
    prompt += `- Структура: {"phases": [{"name": "...", "tasks": [...], "duration": "..."}]}\n`;
    prompt += `- Количество этапов: 4-6\n`;
    prompt += `- Количество задач на этап: 2-4\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}
