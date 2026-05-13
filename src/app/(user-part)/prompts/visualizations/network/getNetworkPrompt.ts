import { NetworkSettings } from "@/store/networkSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { NETWORK_BASE_PROMPT } from "./networkBase";

export function getNetworkPrompt(settings?: NetworkSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + NETWORK_BASE_PROMPT;

  if (settings) {
    const maxNodes = settings.maxNodes || 15;
    const maxEdges = settings.maxEdges || 20;

    prompt += `\n\n**ПАРАМЕТРЫ СЕТЕВОГО ГРАФА:**\n`;
    prompt += `- Максимальное количество узлов: ${maxNodes}\n`;
    prompt += `- Максимальное количество связей: ${maxEdges}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Количество узлов: примерно ${maxNodes}\n`;
    prompt += `3. Количество связей: примерно ${maxEdges}\n`;
    prompt += `4. Группируй узлы по категориям (поле "group")\n`;
    prompt += `5. Указывай размер узлов через "value" (1-10)\n`;
    prompt += `6. Указывай толщину связей через "value" (1-5)\n`;
    prompt += `7. Добавляй подписи к важным связям (поле "label")\n`;
    prompt += `8. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `9. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай сетевой граф в формате JSON\n`;
    prompt += `- Структура: {"nodes": [...], "edges": [...]}\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}