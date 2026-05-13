import { SCIENTIFIC_ARTICLE_STRUCTURE_BASE_PROMPT } from "./articleStructureByMode/articleStructureBase";
import { RESEARCH_SCIENTIFIC_ARTICLE_TEMPLATE } from "./articleStructureByMode/research";
import { REVIEW_SCIENTIFIC_ARTICLE_TEMPLATE } from "./articleStructureByMode/review";
import { SYSTEMATIC_REVIEW_TEMPLATE } from "./articleStructureByMode/systematic";
import { CASE_STUDY_TEMPLATE } from "./articleStructureByMode/case";
import { METHODOLOGICAL_TEMPLATE } from "./articleStructureByMode/methodology";
import { CONFERENCE_THESIS_TEMPLATE } from "./articleStructureByMode/conference";
import { EXPERIMENTAL_TEMPLATE } from "./articleStructureByMode/experimental";
import { LITERATURE_REVIEW_TEMPLATE } from "./articleStructureByMode/literature";
import { HYPOTHESIS_TEMPLATE } from "./articleStructureByMode/hypothesis";

export const SCIENTIFIC_ARTICLE_MODE_TEMPLATES = {
  research: RESEARCH_SCIENTIFIC_ARTICLE_TEMPLATE,
  review: REVIEW_SCIENTIFIC_ARTICLE_TEMPLATE,
  systematic: SYSTEMATIC_REVIEW_TEMPLATE,
  case: CASE_STUDY_TEMPLATE,
  methodology: METHODOLOGICAL_TEMPLATE,
  conference: CONFERENCE_THESIS_TEMPLATE, 
  experimental: EXPERIMENTAL_TEMPLATE,
  literature: LITERATURE_REVIEW_TEMPLATE,
  hypothesis: HYPOTHESIS_TEMPLATE,
} as const;

export type ScientificArticleMode =
  keyof typeof SCIENTIFIC_ARTICLE_MODE_TEMPLATES;

export function getScientificArticleStructurePrompt(mode?: string): string {
  const template =
    mode && SCIENTIFIC_ARTICLE_MODE_TEMPLATES[mode as ScientificArticleMode]
      ? SCIENTIFIC_ARTICLE_MODE_TEMPLATES[mode as ScientificArticleMode]
      : REVIEW_SCIENTIFIC_ARTICLE_TEMPLATE;

  return `${SCIENTIFIC_ARTICLE_STRUCTURE_BASE_PROMPT}\n\n${template}`;
}