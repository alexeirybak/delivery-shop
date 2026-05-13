import { LectureSettings } from "@/store/lectureSettingsStore";
import { LECTURE_BASE_PROMPT } from "./lectureBaze";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getLecturePrompt(settings?: LectureSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + LECTURE_BASE_PROMPT;

  if (settings) {
    prompt += "\n\n**ПАРАМЕТРЫ ЛЕКЦИИ ОТ ПРЕПОДАВАТЕЛЯ:**\n";
    
    if (settings.targetAudience) {
      const audienceMap: Record<string, string> = {
        students_bachelor: "Студенты бакалавриата",
        students_master: "Магистранты",
        postgraduates: "Аспиранты",
        professionals: "Профессионалы",
        mixed: "Смешанная аудитория",
      };
      prompt += `- Целевая аудитория: ${audienceMap[settings.targetAudience] || settings.targetAudience}\n`;
    }
    
    if (settings.level) {
      const levelMap: Record<string, string> = {
        beginner: "Начальный",
        intermediate: "Средний",
        advanced: "Продвинутый",
        expert: "Экспертный",
      };
      prompt += `- Уровень подготовки: ${levelMap[settings.level] || settings.level}\n`;
    }
    
    if (settings.duration) {
      const durationMap: Record<string, string> = {
        "15": "15 минут (мини-лекция)",
        "30": "30 минут",
        "45": "45 минут (академический час)",
        "60": "60 минут",
        "90": "90 минут (спаренная лекция)",
      };
      prompt += `- Длительность: ${durationMap[settings.duration] || settings.duration}\n`;
    }
    
    if (settings.style) {
      const styleMap: Record<string, string> = {
        academic: "Академический (строгий, научный)",
        practical: "Практический (кейсы, примеры)",
        problematic: "Проблемный (вопросы, дискуссия)",
        narrative: "Нарративный (рассказ, история)",
        interactive: "Интерактивный (вовлечение аудитории)",
      };
      prompt += `- Стиль изложения: ${styleMap[settings.style] || settings.style}\n`;
    }
    
    if (settings.focusAreas) {
      prompt += `- Акценты в содержании: ${settings.focusAreas}\n`;
    }

    prompt += "\n**СТРУКТУРА ЛЕКЦИИ (включенные блоки):**\n";
    prompt += `- Цель и задачи: ${settings.includeGoal ? "да" : "нет"}\n`;
    prompt += `- План лекции: ${settings.includeOutline ? "да" : "нет"}\n`;
    prompt += `- Ключевые термины: ${settings.includeKeyTerms ? "да" : "нет"}\n`;
    prompt += `- Примеры и кейсы: ${settings.includeExamples ? "да" : "нет"}\n`;
    prompt += `- Резюме и выводы: ${settings.includeSummary ? "да" : "нет"}\n`;
    prompt += `- Контрольные вопросы: ${settings.includeQuestions ? "да" : "нет"}\n`;
    prompt += `- Список литературы: ${settings.includeReferences ? "да" : "нет"}\n`;

    const duration = parseInt(settings.duration || "45");
    let contentVolume = "";
    if (duration <= 15) {
      contentVolume = "Создай компактную мини-лекцию. Основной материал должен укладываться в 5-7 минут, остальное время на введение и заключение.";
    } else if (duration <= 30) {
      contentVolume = "Создай лекцию средней продолжительности. Раскрой ключевые аспекты темы, но избегай излишней детализации.";
    } else if (duration <= 60) {
      contentVolume = "Создай полноценную лекцию. Детально раскрой тему, приведи несколько примеров и кейсов.";
    } else {
      contentVolume = "Создай расширенную лекцию. Глубоко проработай тему, включи множество примеров, дополнительный материал и практические задания.";
    }
    
    prompt += `\n**ОБЪЁМ И ДЕТАЛИЗАЦИЯ:**\n${contentVolume}\n`;
  }

  return prompt;
}