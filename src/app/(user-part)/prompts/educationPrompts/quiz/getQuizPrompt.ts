import { QuizSettings } from "@/store/quizSettingsStore";
import { QUIZ_BASE_PROMPT } from "./quizBase";

export function getQuizPrompt(settings?: QuizSettings): string {
  let prompt = QUIZ_BASE_PROMPT;

  if (settings) {
    prompt += "\n\n**ПАРАМЕТРЫ ТЕСТА ОТ ПРЕПОДАВАТЕЛЯ:**\n";
    
    if (settings.educationLevel) {
      prompt += `- Уровень образования: ${settings.educationLevel}\n`;
    }
    if (settings.questionCount) {
      prompt += `- Количество вопросов: ${settings.questionCount}\n`;
    }
    if (settings.difficulty) {
      prompt += `- Сложность: ${settings.difficulty}\n`;
    }
    if (settings.optionsCount) {
      prompt += `- Количество вариантов ответа: ${settings.optionsCount}\n`;
    }
    if (settings.passingScore) {
      prompt += `- Проходной балл: ${settings.passingScore}%\n`;
    }
    
    if (settings.competence && settings.competence.trim()) {
      prompt += `\n**ПРОВЕРЯЕМАЯ КОМПЕТЕНЦИЯ:**\n`;
      prompt += `${settings.competence}\n`;
      prompt += `\nВсе вопросы теста должны быть направлены на проверку УКАЗАННОЙ КОМПЕТЕНЦИИ.\n`;
      prompt += `Каждый вопрос должен соответствовать заявленной компетенции и проверять ее сформированность.\n`;
    }
    
    if (settings.includeExplanation !== undefined) {
      prompt += `\n- Показывать объяснение ответов: ${settings.includeExplanation ? "да" : "нет"}\n`;
    }
    if (settings.randomizeOrder !== undefined) {
      prompt += `- Перемешивать вопросы: ${settings.randomizeOrder ? "да" : "нет"}\n`;
    }
    if (settings.includeMultipleChoice !== undefined) {
      prompt += `- Вопросы с выбором ответа: ${settings.includeMultipleChoice ? "да" : "нет"}\n`;
    }
    if (settings.includeTrueFalse !== undefined) {
      prompt += `- Вопросы "Верно/Неверно": ${settings.includeTrueFalse ? "да" : "нет"}\n`;
    }
    if (settings.includeOpenEnded !== undefined) {
      prompt += `- Открытые вопросы: ${settings.includeOpenEnded ? "да" : "нет"}\n`;
    }
    if (settings.includeMatching !== undefined) {
      prompt += `- Вопросы на соответствие: ${settings.includeMatching ? "да" : "нет"}\n`;
    }

    const questionCount = parseInt(settings.questionCount || "10");
    const passingScore = parseInt(settings.passingScore || "70");
    const requiredCorrect = Math.ceil(questionCount * passingScore / 100);
    
    prompt += `\n**ВАЖНО:** Создай ровно ${settings.questionCount || "10"} вопросов. Для вопросов с выбором ответа используй ровно ${settings.optionsCount || "4"} вариантов. Уровень сложности: ${settings.difficulty || "средний"}. Проходной балл: ${passingScore}% (нужно правильно ответить на ${requiredCorrect} вопросов из ${questionCount}).\n`;
  }

  return prompt;
}