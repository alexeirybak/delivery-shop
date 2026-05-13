import { LaboratorySettings } from "@/store/laboratorySettingsStore";
import { LABORATORY_BASE_PROMPT } from "./laboratoryBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getLaboratoryPrompt(settings?: LaboratorySettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + LABORATORY_BASE_PROMPT;
  if (settings) {
    prompt += "\n\n**ПАРАМЕТРЫ ЛАБОРАТОРНОЙ РАБОТЫ ОТ ПРЕПОДАВАТЕЛЯ:**\n";
    
    if (settings.targetAudience) {
      const audienceMap: Record<string, string> = {
        students_bachelor: "Студенты бакалавриата",
        students_master: "Магистранты",
        school: "Школьники",
        professionals: "Профессионалы",
      };
      prompt += `- Целевая аудитория: ${audienceMap[settings.targetAudience] || settings.targetAudience}\n`;
    }
    
    if (settings.level) {
      const levelMap: Record<string, string> = {
        beginner: "Начальный",
        intermediate: "Средний",
        advanced: "Продвинутый",
      };
      prompt += `- Уровень подготовки: ${levelMap[settings.level] || settings.level}\n`;
    }
    
    if (settings.duration) {
      const durationMap: Record<string, string> = {
        "45": "45 минут",
        "60": "60 минут",
        "90": "90 минут",
        "120": "120 минут",
        "180": "180 минут",
      };
      prompt += `- Длительность: ${durationMap[settings.duration] || settings.duration}\n`;
    }
    
    if (settings.requiredEquipment && settings.requiredEquipment.trim()) {
      prompt += `\n**НЕОБХОДИМОЕ ОБОРУДОВАНИЕ:**\n${settings.requiredEquipment}\n`;
    }
    
    if (settings.consumables && settings.consumables.trim()) {
      prompt += `\n**РАСХОДНЫЕ МАТЕРИАЛЫ:**\n${settings.consumables}\n`;
    }
    
    if (settings.software && settings.software.trim()) {
      prompt += `\n**ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ:**\n${settings.software}\n`;
    }
    
    prompt += "\n**СТРУКТУРА РАБОТЫ (включенные блоки):**\n";
    prompt += `- Цель и задачи: ${settings.includeGoal ? "да" : "нет"}\n`;
    prompt += `- Теоретическое введение: ${settings.includeTheory ? "да" : "нет"}\n`;
    prompt += `- Ход работы: ${settings.includeProcedure ? "да" : "нет"}\n`;
    prompt += `- Таблицы для наблюдений: ${settings.includeObservations ? "да" : "нет"}\n`;
    prompt += `- Контрольные вопросы: ${settings.includeQuestions ? "да" : "нет"}\n`;
    prompt += `- Требования к отчёту: ${settings.includeReport ? "да" : "нет"}\n`;
    
    if (settings.includeSafetyRules) {
      prompt += `\n**ТЕХНИКА БЕЗОПАСНОСТИ:**\n`;
      prompt += `Обязательно включи раздел с правилами техники безопасности.\n`;
      if (settings.customSafetyRules && settings.customSafetyRules.trim()) {
        prompt += `Дополнительные правила:\n${settings.customSafetyRules}\n`;
      }
    }
    
    if (settings.includeAssessment && settings.assessmentCriteria && settings.assessmentCriteria.trim()) {
      prompt += `\n**КРИТЕРИИ ОЦЕНКИ:**\n${settings.assessmentCriteria}\n`;
    }
    
    const duration = parseInt(settings.duration || "90");
    let contentVolume = "";
    if (duration <= 60) {
      contentVolume = "Создай компактную лабораторную работу. Включи 2-3 простых задания, которые можно выполнить за отведённое время. Теоретическое введение должно быть кратким. Обработку результатов опиши текстом, без таблиц.";
    } else if (duration <= 120) {
      contentVolume = "Создай лабораторную работу средней сложности. Включи 3-4 задания разного уровня. Предусмотри время на обработку результатов и оформление отчёта. Результаты измерений описывай списками, не используй таблицы.";
    } else {
      contentVolume = "Создай углублённую лабораторную работу. Включи 4-5 заданий, подробное теоретическое введение, сложные расчёты и анализ результатов. Предусмотри время на оформление полноценного отчёта. Все данные представляй в виде текста или маркированных списков.";
    }
    
    prompt += `\n**ОБЪЁМ И ДЕТАЛИЗАЦИЯ:**\n${contentVolume}\n`;
    
    prompt += `\n**ВАЖНО:** Не используй Markdown-таблицы. Вместо таблиц описывай данные текстом, маркированными или нумерованными списками. Например:\n`;
    prompt += `"- Измерение 1: получено значение X\n- Измерение 2: получено значение Y"`;
  }

  return prompt;
}