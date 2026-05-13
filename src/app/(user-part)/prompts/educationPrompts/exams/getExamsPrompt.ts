import { ExamsSettings } from "@/store/examsSettingsStore";
import { EXAMS_BASE_PROMPT } from "./examsBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

export function getExamsPrompt(settings?: ExamsSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + EXAMS_BASE_PROMPT;

  if (settings) {
    const questionCount = parseInt(settings.questionCount || "20");
    
    prompt += `\n\n**ПАРАМЕТРЫ ЭКЗАМЕНА:**\n`;
    prompt += `- Тип экзамена: ${settings.examType === "final" ? "Итоговый" : settings.examType === "midterm" ? "Промежуточный" : "Вступительный"}\n`;
    prompt += `- Уровень сложности: ${settings.level === "beginner" ? "Начальный" : settings.level === "intermediate" ? "Средний" : settings.level === "advanced" ? "Продвинутый" : "Экспертный"}\n`;
    prompt += `- Длительность: ${settings.duration} минут\n`;
    prompt += `- Шкала оценок: ${settings.gradingScale === "5_point" ? "5-балльная" : settings.gradingScale === "100_point" ? "100-балльная" : settings.gradingScale === "european" ? "ECTS" : "Зачёт/Незачёт"}\n`;
    prompt += `- Проходной балл: ${settings.passingScore || "60"}%\n\n`;
    
    prompt += `**СТРУКТУРА ЭКЗАМЕНА:**\n`;
    if (settings.includeTheory) prompt += `- Теоретические вопросы: ${questionCount} вопросов\n`;
    if (settings.includePractice) prompt += `- Практические задания: 3-5 заданий\n`;
    if (settings.includeTest) prompt += `- Тестовые задания: 10-15 тестов\n`;
    if (settings.includeCases) prompt += `- Кейсы: 1-2 кейса\n`;
    
    if (settings.allowedMaterials && settings.allowedMaterials.trim()) {
      prompt += `\n**РАЗРЕШЕННЫЕ МАТЕРИАЛЫ:**\n${settings.allowedMaterials}\n`;
    }
    
    if (settings.evaluationCriteria && settings.evaluationCriteria.trim()) {
      prompt += `\n**КРИТЕРИИ ОЦЕНКИ:**\n${settings.evaluationCriteria}\n`;
    }
    
    prompt += `\n# ========================================\n`;
    prompt += `# ТРЕБОВАНИЯ К ГЕНЕРАЦИИ\n`;
    prompt += `# ========================================\n`;
    prompt += `1. КОЛИЧЕСТВО: создай РОВНО ${questionCount} теоретических вопросов. Ни больше, ни меньше.\n`;
    prompt += `2. ОХВАТ: вопросы должны покрывать ВСЮ дисциплину (начало, середину, конец курса).\n`;
    prompt += `3. ФОРМАТ: каждый вопрос краткий (5-10 слов). Пример: "Понятие преступления", "Виды наказаний".\n`;
    prompt += `4. ЗАПРЕЩЕНО: не пиши ответы, пояснения или критерии к теоретическим вопросам.\n`;
    prompt += `5. НУМЕРАЦИЯ: вопросы должны быть пронумерованы от 1 до ${questionCount}.\n`;
    prompt += `# ========================================\n\n`;
    
    if (settings.includePractice) {
      prompt += `**ДЛЯ ПРАКТИЧЕСКИХ ЗАДАНИЙ:** создай 3-5 задач. Для каждой: условие (2-3 предложения).\n`;
    }
    
    if (settings.includeTest) {
      prompt += `**ДЛЯ ТЕСТОВ:** создай 10-15 вопросов с вариантами ответов. Формат: "Вопрос? (A) A) ... B) ... C) ..."\n`;
    }
    
    if (settings.includeCases) {
      prompt += `**ДЛЯ КЕЙСОВ:** создай 1-2 ситуации (3-4 предложения) и 1-2 вопроса к каждой.\n`;
    }
    
    prompt += `\n**ПРОВЕРЬ СЕБЯ ПЕРЕД ОТВЕТОМ:**\n`;
    prompt += `- [ ] Теоретических вопросов ровно ${questionCount}?\n`;
    prompt += `- [ ] Нумерация от 1 до ${questionCount}?\n`;
    prompt += `- [ ] Вопросы охватывают всю дисциплину?\n`;
    prompt += `- [ ] Нет ответов на теоретические вопросы?\n`;
  }

  return prompt;
}