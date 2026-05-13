import { ComparisonSettings } from "@/store/comparisonSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { COMPARISON_BASE_PROMPT } from "./comparisonBase";

export function getComparisonPrompt(
  settings?: ComparisonSettings,
): string {
  let prompt = FORMATTING_RULES + "\n\n" + COMPARISON_BASE_PROMPT;

  const depthDescriptions = {
    basic: "базовый уровень (основные сходства и различия без углубления в детали)",
    detailed: "детальный уровень (развернутый анализ с подробным рассмотрением каждого аспекта)",
    expert: "экспертный уровень (глубокий критический анализ с выявлением причинно-следственных связей)",
  };

  const formatDescriptions = {
    paragraphs: "связный текст, разделенный на смысловые абзацы",
    list: "маркированные или нумерованные списки для каждого аспекта",
  };

  if (settings) {
    prompt += `\n\n**ПАРАМЕТРЫ СРАВНИТЕЛЬНОГО АНАЛИЗА:**\n`;
    prompt += `- Глубина анализа: ${depthDescriptions[settings.depth]}\n`;
    prompt += `- Максимальное количество пунктов: ${settings.maxItems}\n`;
    prompt += `- Формат вывода: ${formatDescriptions[settings.format]}\n`;
    prompt += `- Указывать источники: ${settings.includeSources ? "да" : "нет"}\n\n`;

    prompt += `**ВКЛЮЧАЕМЫЕ АСПЕКТЫ СРАВНЕНИЯ:**\n`;
    
    const aspectLabels: Record<keyof typeof settings.aspects, string> = {
      similarities: "Сходства",
      differences: "Различия",
      advantages: "Преимущества",
      disadvantages: "Недостатки",
      examples: "Примеры",
      conclusions: "Выводы и рекомендации",
    };

    for (const [key, label] of Object.entries(aspectLabels)) {
      const aspectKey = key as keyof typeof settings.aspects;
      if (settings.aspects[aspectKey]) {
        prompt += `- ✅ ${label}\n`;
      }
    }

    prompt += `\n# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `**ВАЖНО: ЗАПРЕЩЕНО ИСПОЛЬЗОВАТЬ ТАБЛИЦЫ. ТОЛЬКО ТЕКСТ, АБЗАЦЫ ИЛИ СПИСКИ.**\n\n`;

    if (settings.depth === "basic") {
      prompt += `1. Сосредоточься на самых важных и очевидных сходствах и различиях\n`;
      prompt += `2. Не углубляйся в детали, держи анализ лаконичным\n`;
      prompt += `3. Используй простой и понятный язык\n`;
    } else if (settings.depth === "detailed") {
      prompt += `1. Рассмотри каждый аспект всесторонне и развернуто\n`;
      prompt += `2. Приводи аргументы и обоснования для каждого пункта\n`;
      prompt += `3. Используй профессиональную терминологию\n`;
    } else if (settings.depth === "expert") {
      prompt += `1. Проведи глубокий критический анализ\n`;
      prompt += `2. Выяви причинно-следственные связи между различиями\n`;
      prompt += `3. Оцени практическую значимость выявленных отличий\n`;
      prompt += `4. Предложи рекомендации на основе анализа\n`;
    }

    prompt += `\n${settings.maxItems > 0 ? `5. Количество пунктов в каждом аспекте: примерно ${settings.maxItems}\n` : ""}`;
    
    if (settings.format === "list") {
      prompt += `6. Используй маркированные или нумерованные списки для каждого аспекта\n`;
      prompt += `7. Группируй пункты по логическим категориям\n`;
      prompt += `8. НЕ используй таблицы, только списки\n`;
    } else {
      prompt += `6. Раздели ответ на смысловые абзацы по каждому аспекту\n`;
      prompt += `7. Используй подзаголовки для выделения разных аспектов\n`;
      prompt += `8. НЕ используй таблицы, только связный текст\n`;
    }

    if (settings.includeSources) {
      prompt += `9. Указывай источники информации в формате [Источник: название]\n`;
    }

    prompt += `10. Охвати ВСЮ тему\n`;
    prompt += `11. ВЕРНИ ТОЛЬКО АНАЛИЗ, БЕЗ ЛИШНИХ ПОЯСНЕНИЙ\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Проведи сравнительный анализ в формате связного текста\n`;
    prompt += `- ЗАПРЕЩЕНО использовать таблицы. Только текст и абзацы.\n`;
    prompt += `- Включи сходства, различия, преимущества и недостатки\n`;
    prompt += `- Добавь выводы в конце анализа\n`;
    prompt += `- Верни ТОЛЬКО анализ, без пояснений\n`;
  }

  return prompt;
}