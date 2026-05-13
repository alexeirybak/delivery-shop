import { HierarchySettings } from "@/store/hierarchySettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { HIERARCHY_BASE_PROMPT } from "./hierarchyBase";

export function getHierarchyPrompt(settings?: HierarchySettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + HIERARCHY_BASE_PROMPT;

  if (settings) {
    const maxDepth = settings.maxDepth || 3;
    const maxNodes = settings.maxNodes || 30;
    const showRoot = settings.showRoot !== undefined ? settings.showRoot : true;

    prompt += `\n\n**ПАРАМЕТРЫ ИЕРАРХИЧЕСКОЙ СХЕМЫ:**\n`;
    prompt += `- Максимальная глубина вложенности: ${maxDepth} ${maxDepth === 0 ? "(без ограничений)" : "уровня(ей)"}\n`;
    prompt += `- Максимальное количество узлов: ${maxNodes} ${maxNodes === 0 ? "(без ограничений)" : "штук"}\n`;
    prompt += `- Показывать корневой элемент: ${showRoot ? "да" : "нет"}\n\n`;

    prompt += `# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. Используй ТОЛЬКО JSON формат\n`;
    prompt += `2. Максимальная глубина: ${maxDepth} ${maxDepth === 0 ? "(без ограничений)" : "уровней"}\n`;
    prompt += `3. Общее количество узлов: примерно ${maxNodes}\n`;

    if (!showRoot) {
      prompt += `4. НЕ включай корневой узел в результат. Верни массив детей корня как результат\n`;
    } else {
      prompt += `4. Включай корневой узел в результат (уровень 0)\n`;
    }

    prompt += `5. Для каждого узла обязательно указывай "id" (уникальный), "name", "level", "children"\n`;
    prompt += `6. "level" должен соответствовать реальному уровню вложенности\n`;
    prompt += `7. "children" может быть пустым массивом, если у узла нет потомков\n`;
    prompt += `8. "description" - опционально, добавляй для важных узлов\n`;
    prompt += `9. ВЕРНИ ТОЛЬКО JSON, БЕЗ ЛИШНЕГО ТЕКСТА\n`;
    prompt += `10. НЕ оборачивай JSON в Markdown-блоки\n`;
    prompt += `11. Используй осмысленные id (например, "root", "dept_engineering", "team_frontend")\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Создай иерархическую схему в формате JSON\n`;
    prompt += `- Структура: {"id": "root", "name": "...", "level": 0, "children": [...]}\n`;
    prompt += `- Верни ТОЛЬКО JSON, без пояснений\n`;
  }

  return prompt;
}
