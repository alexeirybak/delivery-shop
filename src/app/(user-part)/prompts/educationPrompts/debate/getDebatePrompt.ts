import { DebateSettings } from "@/store/debateSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { DEBATE_BASE_PROMPT } from "./debateBase";

export function getDebatePrompt(
  settings?: DebateSettings,
): string {
  let prompt = FORMATTING_RULES + "\n\n" + DEBATE_BASE_PROMPT;

  const formatDescriptions = {
    classical:
      "Классические дебаты — две команды, последовательные выступления, регламентированное время",
    parliamentary:
      "Парламентские дебаты — британский формат, правительство vs оппозиция, 4 команды",
    lincoln_douglas:
      "Формат Линкольна-Дугласа — 1v1, акцент на ценностях и этике",
    sparring: "Спарринг — тренировочный формат, упрощенные правила",
  };

  const difficultyDescriptions = {
    beginner:
      "начальный уровень — базовые аргументы, простые формулировки, четкая структура",
    intermediate:
      "средний уровень — развернутая аргументация, логические связки, контраргументы",
    advanced:
      "продвинутый уровень — глубокий анализ, сложные конструкции, стратегические аргументы",
  };

  if (settings) {
    prompt += `\n\n**ПАРАМЕТРЫ ДЕБАТОВ:**\n`;
    prompt += `- Формат: ${formatDescriptions[settings.format]}\n`;
    prompt += `- Длительность: ${settings.duration} минут\n`;
    prompt += `- Количество участников: ${settings.participantsCount}\n`;
    prompt += `- Уровень сложности: ${difficultyDescriptions[settings.difficulty]}\n\n`;

    prompt += `**ВКЛЮЧАЕМЫЕ ЭЛЕМЕНТЫ ДЕБАТОВ:**\n`;

    const elementsMap = [
      { key: "includeOpening", label: "Вступительные речи" },
      { key: "includeRebuttals", label: "Контраргументы и опровержения" },
      { key: "includeCrossExamination", label: "Перекрестные вопросы" },
      { key: "includeClosing", label: "Заключительные речи" },
      { key: "includeJudging", label: "Критерии оценки и судейство" },
    ];

    for (const element of elementsMap) {
      const key = element.key as keyof DebateSettings;
      if (settings[key] as boolean) {
        prompt += `- ${element.label}\n`;
      }
    }

    prompt += `\n**СОДЕРЖАНИЕ АРГУМЕНТОВ:**\n`;

    const contentMap = [
      { key: "includeArguments", label: "Основные аргументы" },
      { key: "includeCounterArguments", label: "Контраргументы" },
      { key: "includeEvidence", label: "Доказательства и источники" },
      { key: "includeExamples", label: "Примеры и кейсы" },
    ];

    for (const item of contentMap) {
      const key = item.key as keyof DebateSettings;
      if (settings[key] as boolean) {
        prompt += `- ${item.label}\n`;
      }
    }

    prompt += `\n# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;

    if (settings.difficulty === "beginner") {
      prompt += `1. Используй простой и понятный язык\n`;
      prompt += `2. Аргументы должны быть четкими и однозначными\n`;
      prompt += `3. Структура должна быть максимально прозрачной\n`;
      prompt += `4. Избегай сложной терминологии\n`;
    } else if (settings.difficulty === "intermediate") {
      prompt += `1. Используй профессиональную терминологию с пояснениями\n`;
      prompt += `2. Аргументы должны быть развернутыми и обоснованными\n`;
      prompt += `3. Добавляй логические связки между аргументами\n`;
      prompt += `4. Учитывай возможные контраргументы\n`;
    } else if (settings.difficulty === "advanced") {
      prompt += `1. Используй сложную профессиональную терминологию\n`;
      prompt += `2. Проводи глубокий анализ с разных точек зрения\n`;
      prompt += `3. Строй стратегические цепочки аргументов\n`;
      prompt += `4. Предусматривай сложные контраргументы\n`;
      prompt += `5. Добавляй рейтинг убедительности аргументов\n`;
    }

    prompt += `\n${settings.includeArguments ? `6. Разработай аргументы для КАЖДОЙ стороны (ЗА и ПРОТИВ)\n` : ""}`;
    prompt += `${settings.includeCounterArguments ? `7. Для каждого аргумента предложи возможные контраргументы\n` : ""}`;
    prompt += `${settings.includeEvidence ? `8. Подкрепляй аргументы доказательствами и ссылками на источники\n` : ""}`;
    prompt += `${settings.includeExamples ? `9. Используй конкретные примеры и реальные кейсы\n` : ""}`;
    prompt += `${settings.includeOpening ? `10. Вступительные речи должны представлять позицию и ключевые тезисы\n` : ""}`;
    prompt += `${settings.includeRebuttals ? `11. Контраргументы должны быть структурированными и логичными\n` : ""}`;
    prompt += `${settings.includeCrossExamination ? `12. Подготовь возможные вопросы для перекрестного допроса\n` : ""}`;
    prompt += `${settings.includeClosing ? `13. Заключительные речи должны подводить итог и усиливать позицию\n` : ""}`;
    prompt += `${settings.includeJudging ? `14. Предложи четкие критерии оценки выступлений\n` : ""}`;

    prompt += `\n15. Учитывай временные рамки: ${settings.duration} минут\n`;
    prompt += `16. Распредели время между участниками (${settings.participantsCount} человек)\n`;
    prompt += `17. Охвати ВСЮ тему`;
    prompt += `18. ВЕРНИ ТОЛЬКО МАТЕРИАЛ ДЛЯ ДЕБАТОВ, БЕЗ ЛИШНИХ ПОЯСНЕНИЙ\n`;
    prompt += `# ========================================\n`;
  } else {
    prompt += `\n\n**ТРЕБОВАНИЯ:**\n`;
    prompt += `- Подготовь материал для дебатов в формате связного текста\n`;
    prompt += `- Включи аргументы ЗА и ПРОТИВ\n`;
    prompt += `- Добавь контраргументы и опровержения\n`;
    prompt += `- Приведи примеры и доказательства\n`;
    prompt += `- Добавь выводы и рекомендации\n`;
    prompt += `- Верни ТОЛЬКО материал для дебатов, без пояснений\n`;
  }

  return prompt;
}
