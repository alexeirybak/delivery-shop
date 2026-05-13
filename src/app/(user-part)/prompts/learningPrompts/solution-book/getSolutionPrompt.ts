import { SolutionSettings } from "@/store/solutionSettingsStore";
import { SOLUTION_BASE_PROMPT } from "./solutionBase";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";

const DISCIPLINE_DESCRIPTIONS = {
  humanities: "гуманитарным наукам (литература, история, философия, право)",
  natural_science:
    "естественным наукам (биология, физика, химия, география, медицина)",
  technical: "техническим наукам (машиностроение, инженерия, информатика)",
  mathematics: "математике (алгебра, геометрия, матанализ, экономика)",
};

const EDUCATION_LEVELS = {
  school_5: "5-9 классов школы",
  school_10: "10-11 классов школы",
  college: "колледжа / техникума",
  university_bachelor: "бакалавриата университета",
  university_master: "магистратуры университета",
};

const DETAIL_LEVELS = {
  simple:
    "просто и доступно, как для начинающего. Используй аналогии и примеры из жизни",
  normal: "подробно, но без излишних сложностей. Объясняй логику решения",
  expert:
    "максимально подробно, на экспертном уровне. Используй профессиональную терминологию",
};

export function getSolutionPrompt(settings: SolutionSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + SOLUTION_BASE_PROMPT;

  const disciplineText =
    DISCIPLINE_DESCRIPTIONS[
      settings.discipline as keyof typeof DISCIPLINE_DESCRIPTIONS
    ] || DISCIPLINE_DESCRIPTIONS.mathematics;

  const educationText =
    EDUCATION_LEVELS[
      settings.educationLevel as keyof typeof EDUCATION_LEVELS
    ] || EDUCATION_LEVELS.school_10;

  const detailText =
    DETAIL_LEVELS[settings.detailLevel as keyof typeof DETAIL_LEVELS] ||
    DETAIL_LEVELS.normal;

  prompt += `\n\nТвоя специализация: ${disciplineText}.`;

  if (settings.subject) {
    prompt += `\nТекущая тема: ${settings.subject}.`;
  }

  prompt += `\nУровень ученика: ${educationText}.`;
  prompt += `\nСтиль объяснения: ${detailText}.`;

  if (settings.showSteps) {
    prompt += `\nОбязательно показывай пошаговое решение задачи. Каждый шаг должен быть понятен ученику.`;
  }

  if (settings.provideExamples) {
    prompt += `\nПриводи понятные примеры для иллюстрации решений.`;
  }

  if (settings.useFormulas) {
    prompt += `\nИспользуй формулы и математические обозначения, когда это уместно.`;
  }

  return prompt;
}
