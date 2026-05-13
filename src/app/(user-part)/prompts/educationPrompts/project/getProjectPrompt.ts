import { ProjectSettings } from "@/store/projectSettingsStore";
import { PROJECT_BASE_PROMPT } from "./projectBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getProjectPrompt(settings?: ProjectSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + PROJECT_BASE_PROMPT;

  if (settings) {
    prompt += "\n\n**ПАРАМЕТРЫ ПРОЕКТНОЙ РАБОТЫ ОТ ПРЕПОДАВАТЕЛЯ:**\n";

    if (settings.projectType) {
      const typeMap: Record<string, string> = {
        research: "Исследовательский проект",
        practical: "Практико-ориентированный проект",
        creative: "Творческий проект",
        social: "Социальный проект",
        business: "Бизнес-проект",
        it: "IT-проект",
      };
      prompt += `- Тип проекта: ${typeMap[settings.projectType] || settings.projectType}\n`;
    }

    if (settings.level) {
      const levelMap: Record<string, string> = {
        beginner: "Начальный",
        intermediate: "Средний",
        advanced: "Продвинутый",
        expert: "Экспертный",
      };
      prompt += `- Уровень сложности: ${levelMap[settings.level] || settings.level}\n`;
    }

    if (settings.workFormat) {
      const formatMap: Record<string, string> = {
        individual: "Индивидуальный",
        pair: "В паре",
        small_group: "Малая группа (3-4 человека)",
        team: "Команда (5-7 человек)",
        large_group: "Крупная группа (8+ человек)",
      };
      prompt += `- Формат работы: ${formatMap[settings.workFormat] || settings.workFormat}\n`;
    }

    if (settings.duration) {
      const durationMap: Record<string, string> = {
        "1_week": "1 неделя (мини-проект)",
        "2_weeks": "2 недели",
        "1_month": "1 месяц",
        "2_months": "2 месяца",
        "1_semester": "1 семестр",
        year: "Годовой проект",
      };
      prompt += `- Длительность: ${durationMap[settings.duration] || settings.duration}\n`;
    }

    prompt += "\n**СТРУКТУРА ПРОЕКТА (включенные блоки):**\n";
    prompt += `- Цель и задачи: ${settings.includeGoal ? "да" : "нет"}\n`;
    prompt += `- План работы: ${settings.includePlan ? "да" : "нет"}\n`;
    prompt += `- Обзор литературы: ${settings.includeLiterature ? "да" : "нет"}\n`;
    prompt += `- Методология: ${settings.includeMethodology ? "да" : "нет"}\n`;
    prompt += `- Результаты и выводы: ${settings.includeResults ? "да" : "нет"}\n`;
    prompt += `- Рекомендации по презентации: ${settings.includePresentation ? "да" : "нет"}\n`;

    if (settings.evaluationCriteria && settings.evaluationCriteria.trim()) {
      prompt += `\n**КРИТЕРИИ ОЦЕНКИ:**\n${settings.evaluationCriteria}\n`;
    }

    if (settings.maxScore && settings.maxScore !== "") {
      prompt += `- Максимальный балл: ${settings.maxScore}\n`;
    }

    if (settings.requirements && settings.requirements.trim()) {
      prompt += `\n**ТРЕБОВАНИЯ К ОФОРМЛЕНИЮ:**\n${settings.requirements}\n`;
    }

    if (settings.resources && settings.resources.trim()) {
      prompt += `\n**РЕКОМЕНДУЕМЫЕ РЕСУРСЫ:**\n${settings.resources}\n`;
    }

    let contentVolume = "";
    if (settings.duration === "1_week") {
      contentVolume =
        "Создай компактный мини-проект. Сосредоточься на ключевых элементах: цель, план, основные результаты.";
    } else if (settings.duration === "1_month") {
      contentVolume =
        "Создай полноценный проект средней сложности. Детально опиши все этапы, методологию и результаты.";
    } else {
      contentVolume =
        "Создай масштабный проект. Дай глубокую проработку темы, подробное описание методологии, детальный анализ результатов.";
    }

    prompt += `\n**ОБЪЁМ И ДЕТАЛИЗАЦИЯ:**\n${contentVolume}\n`;
  }

  return prompt;
}
