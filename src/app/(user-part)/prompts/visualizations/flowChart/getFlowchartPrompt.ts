import { FlowchartSettings } from "@/store/flowchartSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { FLOWCHART_BASE_PROMPT } from "./flowchartBase";

export function getFlowchartPrompt(settings?: FlowchartSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + FLOWCHART_BASE_PROMPT;

  if (settings) {
    const maxNodes = settings.maxNodes || 10;

    prompt += `\n\n**ПАРАМЕТРЫ БЛОК-СХЕМЫ:**\n`;
    prompt += `- Максимальное количество узлов: ${maxNodes}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Количество узлов: примерно ${maxNodes}\n`;
    prompt += `3. Используй все необходимые типы узлов (start, process, decision, input, output, end)\n`;
    prompt += `4. Для decision узлов создавай ровно 2 дочерних узла\n`;
    prompt += `5. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `6. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай блок-схему в формате JSON\n`;
    prompt += `- Используй типы узлов: start, process, decision, input, output, end\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}