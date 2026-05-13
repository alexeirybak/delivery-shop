import { SyllabusSettings } from "@/store/syllabusSettingsStore";
import { SYLLABUS_BASE_PROMPT } from "./syllabusBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getSyllabusPrompt(settings?: SyllabusSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + SYLLABUS_BASE_PROMPT;

  if (settings) {
    prompt += "\n\n**ПАРАМЕТРЫ КУРСА ОТ ПРЕПОДАВАТЕЛЯ:**\n";

    if (settings.courseName) {
      prompt += `- Название дисциплины: ${settings.courseName}\n`;
    }
    if (settings.direction) {
      prompt += `- Направление подготовки: ${settings.direction} (${settings.directionCode || ""})\n`;
    }
    if (settings.educationLevel) {
      prompt += `- Уровень подготовки: ${settings.educationLevel}\n`;
    }
    if (settings.profile) {
      prompt += `- Профиль: ${settings.profile}\n`;
    }
    if (settings.studyForm) {
      prompt += `- Форма обучения: ${settings.studyForm}\n`;
    }
    if (settings.courseYear) {
      prompt += `- Курс: ${settings.courseYear}\n`;
    }
    if (settings.lectureHours) {
      prompt += `- Лекционные часы: ${settings.lectureHours}\n`;
    }
    if (settings.practiceHours) {
      prompt += `- Практические часы: ${settings.practiceHours}\n`;
    }
    if (settings.labHours) {
      prompt += `- Лабораторные часы: ${settings.labHours}\n`;
    }
    if (settings.selfStudyHours) {
      prompt += `- Часы на СРС: ${settings.selfStudyHours}\n`;
    }
    if (settings.totalHours) {
      prompt += `- Всего часов: ${settings.totalHours}\n`;
    }
    if (settings.credits) {
      prompt += `- ЗЕТ (кредитов): ${settings.credits}\n`;
    }
    if (settings.courseType) {
      prompt += `- Тип курса: ${settings.courseType}\n`;
    }
    if (settings.difficulty) {
      prompt += `- Уровень сложности: ${settings.difficulty}\n`;
    }
    if (settings.assessmentForm) {
      prompt += `- Форма аттестации: ${settings.assessmentForm}\n`;
    }
    if (settings.preferredMethods) {
      prompt += `- Предпочитаемые методы обучения: ${settings.preferredMethods}\n`;
    }
    if (settings.preferredAssessment) {
      prompt += `- Предпочитаемые формы контроля: ${settings.preferredAssessment}\n`;
    }
    if (settings.availableSoftware) {
      prompt += `- Доступное ПО: ${settings.availableSoftware}\n`;
    }
    if (settings.availableEquipment) {
      prompt += `- Доступное оборудование: ${settings.availableEquipment}\n`;
    }
    if (settings.studentFeatures) {
      prompt += `- Особенности контингента: ${settings.studentFeatures}\n`;
    }
    if (settings.limitations) {
      prompt += `- Ограничения: ${settings.limitations}\n`;
    }

    prompt += `\nИспользуй эти параметры для заполнения соответствующих полей в силлабусе. Если каких-то параметров нет, оставь заполнители [в квадратных скобках].\n`;
  }

  return prompt;
}
