import { MindmapSettings } from "@/store/mindmapSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { MINDMAP_BASE_PROMPT } from "./mindmapBase";

export function getMindmapPrompt(settings?: MindmapSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + MINDMAP_BASE_PROMPT;

  if (settings) {
    const depth = parseInt(settings.depth || "3");
    const nodeCount = parseInt(settings.nodeCount || "15");

    prompt += `\n\n**ПАРАМЕТРЫ МЕНТАЛЬНОЙ КАРТЫ:**\n`;
    prompt += `- Максимальная глубина: ${depth} уровня\n`;
    prompt += `- Примерное количество узлов: ${nodeCount}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Глубина карты: до ${depth} уровней\n`;
    prompt += `3. Количество узлов: примерно ${nodeCount}\n`;
    prompt += `4. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `5. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай ментальную карту в формате JSON\n`;
    prompt += `- Структура: {"name": "Центральная тема", "children": [...]}\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}