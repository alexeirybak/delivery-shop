import { PracticalSettings } from "@/store/practicalSettingsStore";
import { PRACTICE_BASE_PROMPT } from "./practiceBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getPracticePrompt(settings?: PracticalSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + PRACTICE_BASE_PROMPT;

  if (settings) {
    prompt += "\n\n**ПАРАМЕТРЫ ПРАКТИЧЕСКОГО ЗАНЯТИЯ ОТ ПРЕПОДАВАТЕЛЯ:**\n";

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
        "45": "45 минут (академический час)",
        "60": "60 минут",
        "90": "90 минут (спаренное занятие)",
        "120": "120 минут (2 академических часа)",
        "180": "180 минут (3 академических часа)",
      };
      prompt += `- Длительность занятия: ${durationMap[settings.duration] || settings.duration}\n`;
    }

    if (settings.practicalType) {
      const typeMap: Record<string, string> = {
        seminar: "Семинар",
        workshop: "Практикум / Workshop",
        case_study: "Разбор кейсов",
        discussion: "Дискуссия",
        round_table: "Круглый стол",
        problem_solving: "Решение практических задач",
        role_play: "Ролевая игра",
      };
      prompt += `- Тип занятия: ${typeMap[settings.practicalType] || settings.practicalType}\n`;
    }

    if (settings.workFormat) {
      const formatMap: Record<string, string> = {
        individual: "Индивидуальная",
        pairs: "В парах",
        small_groups: "В малых группах (3-5 человек)",
        team: "Командная (5-7 человек)",
        collective: "Коллективное обсуждение",
        mixed: "Смешанный формат",
      };
      prompt += `- Форма работы: ${formatMap[settings.workFormat] || settings.workFormat}\n`;
    }

    if (settings.groupSize && settings.groupSize !== "") {
      prompt += `- Количество участников: ${settings.groupSize} человек\n`;
    }

    if (settings.style) {
      const styleMap: Record<string, string> = {
        academic: "Академический",
        interactive: "Интерактивный",
        problem: "Проблемно-ориентированный",
        practice: "Практико-ориентированный",
        discussion: "Дискуссионный",
      };
      prompt += `- Стиль проведения: ${styleMap[settings.style] || settings.style}\n`;
    }

    if (settings.additionalNotes && settings.additionalNotes.trim()) {
      prompt += `- Дополнительные пожелания: ${settings.additionalNotes}\n`;
    }

    prompt += "\n**СТРУКТУРА ЗАНЯТИЯ (включенные блоки):**\n";
    prompt += `- Цели и задачи: ${settings.includeGoal ? "да" : "нет"}\n`;
    prompt += `- План занятия: ${settings.includePlan ? "да" : "нет"}\n`;
    prompt += `- Краткий теоретический блок: ${settings.includeTheoretical ? "да" : "нет"}\n`;
    prompt += `- Практические задания: ${settings.includeTasks ? "да" : "нет"}\n`;
    prompt += `- Вопросы для обсуждения: ${settings.includeDiscussion ? "да" : "нет"}\n`;
    prompt += `- Подведение итогов: ${settings.includeSummary ? "да" : "нет"}\n`;
    prompt += `- Список литературы: ${settings.includeReferences ? "да" : "нет"}\n`;

    if (
      settings.includeAssessment &&
      settings.assessmentCriteria &&
      settings.assessmentCriteria.trim()
    ) {
      prompt += `\n**КРИТЕРИИ ОЦЕНКИ:**\n${settings.assessmentCriteria}\n`;
    }

    const duration = parseInt(settings.duration || "90");
    let contentVolume = "";
    if (duration <= 45) {
      contentVolume =
        "Создай компактное занятие. Включи 2-3 простых задания, которые можно выполнить за отведённое время.";
    } else if (duration <= 90) {
      contentVolume =
        "Создай занятие средней продолжительности. Включи 3-4 задания разного уровня сложности, предусмотри время на обсуждение.";
    } else if (duration <= 120) {
      contentVolume =
        "Создай расширенное занятие. Включи 4-5 заданий, в том числе кейсы и задачи повышенной сложности. Предусмотри время на разбор ошибок.";
    } else {
      contentVolume =
        "Создай углублённое занятие. Включи 5-6 заданий, комплексные кейсы, групповую работу и презентацию результатов.";
    }

    prompt += `\n**ОБЪЁМ И ДЕТАЛИЗАЦИЯ:**\n${contentVolume}\n`;

    const taskCount = settings.includeTasks
      ? duration <= 45
        ? 2
        : duration <= 90
          ? 3
          : duration <= 120
            ? 4
            : 5
      : 0;
    if (taskCount > 0) {
      prompt += `\n**РЕКОМЕНДАЦИИ ПО ЗАДАНИЯМ:**\n`;
      prompt += `- Создай ${taskCount} практических заданий\n`;
      prompt += `- Первое задание — базовое, на понимание\n`;
      prompt += `- Второе задание — на применение знаний\n`;
      prompt += `- Третье задание — проблемное или кейс\n`;
      if (taskCount >= 4) {
        prompt += `- Четвёртое задание — творческое или исследовательское\n`;
      }
      if (taskCount >= 5) {
        prompt += `- Пятое задание — командное или проектное\n`;
      }
    }
  }

  return prompt;
}
