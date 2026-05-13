import { InteractiveSettings } from "@/store/interactiveSettingsStore";
import { INTERACTIVE_BASE_PROMPT } from "./interactiveBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getInteractivePrompt(settings?: InteractiveSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + INTERACTIVE_BASE_PROMPT;

  if (settings) {
    prompt += "\n\n**ПАРАМЕТРЫ ИНТЕРАКТИВНОГО УРОКА ОТ ПРЕПОДАВАТЕЛЯ:**\n";
    
    if (settings.targetAudience) {
      const audienceMap: Record<string, string> = {
        students_bachelor: "Студенты бакалавриата",
        students_master: "Магистранты",
        school: "Школьники",
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
      };
      prompt += `- Уровень подготовки: ${levelMap[settings.level] || settings.level}\n`;
    }
    
    if (settings.participantCount && settings.participantCount !== "") {
      prompt += `- Количество участников: ${settings.participantCount} человек\n`;
    }
    
    if (settings.duration) {
      prompt += `- Длительность урока: ${settings.duration} минут\n`;
    }
    
    if (settings.interactiveType) {
      const typeMap: Record<string, string> = {
        quiz: "Викторина / Тест",
        game: "Игровой урок",
        discussion: "Интерактивная дискуссия",
        brainstorm: "Мозговой штурм",
        role_play: "Ролевая игра",
        case_study: "Разбор кейсов",
        simulation: "Симуляция",
      };
      prompt += `- Тип урока: ${typeMap[settings.interactiveType] || settings.interactiveType}\n`;
    }
    
    if (settings.engagementMethods && settings.engagementMethods.trim()) {
      prompt += `\n**МЕТОДЫ ВОВЛЕЧЕНИЯ:**\n${settings.engagementMethods}\n`;
    }
    
    prompt += "\n**ВКЛЮЧЕННЫЕ АКТИВНОСТИ:**\n";
    prompt += `- Разминка: ${settings.includeWarmup ? "да" : "нет"}\n`;
    prompt += `- Опросы/голосования: ${settings.includePoll ? "да" : "нет"}\n`;
    prompt += `- Групповая работа: ${settings.includeGroupWork ? "да" : "нет"}\n`;
    prompt += `- Викторина/квиз: ${settings.includeQuiz ? "да" : "нет"}\n`;
    prompt += `- Дискуссия: ${settings.includeDiscussion ? "да" : "нет"}\n`;
    prompt += `- Рефлексия: ${settings.includeReflection ? "да" : "нет"}\n`;
    
    if (settings.includePoints || settings.includeBadges || settings.includeLeaderboard || settings.includeFeedback) {
      prompt += "\n**СИСТЕМА МОТИВАЦИИ:**\n";
      if (settings.includePoints) prompt += `- Система баллов\n`;
      if (settings.includeBadges) prompt += `- Награды и бейджи\n`;
      if (settings.includeLeaderboard) prompt += `- Таблица лидеров\n`;
      if (settings.includeFeedback) prompt += `- Мгновенная обратная связь\n`;
    }
    
    const duration = parseInt(settings.duration || "60");
    let activityCount = "";
    if (duration <= 45) {
      activityCount = "Включи 2-3 основные активности, разминку и краткую рефлексию.";
    } else if (duration <= 90) {
      activityCount = "Включи 3-4 основные активности, разминку и полноценную рефлексию.";
    } else {
      activityCount = "Включи 4-5 основных активностей, разминку, несколько раундов викторины и детальную рефлексию.";
    }
    
    prompt += `\n**ОБЪЁМ И ДЕТАЛИЗАЦИЯ:**\n${activityCount}\n`;
  }

  return prompt;
}