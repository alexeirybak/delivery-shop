import { SyllabusSettings } from "@/store/syllabusSettingsStore";
import { QuizSettings } from "@/store/quizSettingsStore";
import { getFullScientificArticlePrompt } from "@/app/(user-part)/prompts/scientificArticlePrompts/fullScientificArticle";
import { getScientificArticleStructurePrompt } from "@/app/(user-part)/prompts/scientificArticlePrompts/scientificArticleStructure";
import { getSystemPrompt } from "@/app/(user-part)/prompts/systemPrompts";
import { getSyllabusPrompt } from "@/app/(user-part)/prompts/educationPrompts/syllabus/getSyllabusPrompt";
import { GenerationSettings } from "../user-dashboard/types";
import { ArticleSettings } from "@/store/scientificArticleSettingsStore";
import { getQuizPrompt } from "./educationPrompts/quiz/getQuizPrompt";
import { getLecturePrompt } from "./educationPrompts/lecture/getLecturePrompt";
import { LectureSettings } from "@/store/lectureSettingsStore";
import { CHAT_EDUCATION_PROMPT } from "./educationPrompts/chat-education/chat-education";
import { ANNOTATION_PROMPT } from "./educationPrompts/annotation/annotationPrompt";
import { getHomeworkPrompt } from "./educationPrompts/homework/getHomeworkPrompt";
import { HomeworkSettings } from "@/store/homeworkSettingsStore";
import { getPracticePrompt } from "./educationPrompts/practice/getPracticePrompt";
import { PracticalSettings } from "@/store/practicalSettingsStore";
import { getLaboratoryPrompt } from "./educationPrompts/laboratory/getLaboratoryPrompt";
import { LaboratorySettings } from "@/store/laboratorySettingsStore";
import { getInteractivePrompt } from "./educationPrompts/interactive/getInteractivePrompt";
import { InteractiveSettings } from "@/store/interactiveSettingsStore";
import { getProjectPrompt } from "./educationPrompts/project/getProjectPrompt";
import { ProjectSettings } from "@/store/projectSettingsStore";
import { getExamsPrompt } from "./educationPrompts/exams/getExamsPrompt";
import { ExamsSettings } from "@/store/examsSettingsStore";
import { getCreditPrompt } from "./educationPrompts/credit/getCreditPrompt";
import { CreditSettings } from "@/store/creditSettingsStore";
import { getMindmapPrompt } from "./visualizations/mindmap/getMindmapPrompt";
import { MindmapSettings } from "@/store/mindmapSettingsStore";
import { getFlowchartPrompt } from "./visualizations/flowChart/getFlowchartPrompt";
import { FlowchartSettings } from "@/store/flowchartSettingsStore";
import { getNetworkPrompt } from "./visualizations/network/getNetworkPrompt";
import { NetworkSettings } from "@/store/networkSettingsStore";
import { getBarchartPrompt } from "./visualizations/barChart/getBarchartPrompt";
import { BarchartSettings } from "@/store/barchartSettingsStore";
import { PieChartSettings } from "@/store/pieChartSettingsStore";
import { getPieChartPrompt } from "./visualizations/pieChart/getPieChartPrompt";
import { RadarChartSettings } from "@/store/radarChartSettingsStore";
import { getRadarChartPrompt } from "./visualizations/radarChart/getRadarChartPrompt";
import { getLineChartPrompt } from "./visualizations/lineChart/getLineChartPrompt";
import { LineChartSettings } from "@/store/lineChartSettingsStore";
import { getComparisonTablePrompt } from "./visualizations/comparisonTable/getComparisonTablePrompt";
import { ComparisonTableSettings } from "@/store/comparisonTableSettingsStore";
import { RoadmapSettings } from "@/store/roadmapSettingsStore";
import { getRoadmapPrompt } from "./visualizations/roadmap/getRoadmapPrompt";
import { getHierarchyPrompt } from "./visualizations/hierarchy/getHierarchyPrompt";
import { getTimelinePrompt } from "./visualizations/timeline/getTimelinePrompt";
import { TimelineSettings } from "@/store/timelineSettingsStore";
import { getComparisonPrompt } from "./educationPrompts/comparison/getComparisonPrompt";
import { ComparisonSettings } from "@/store/comparisonSettingsStore";
import { getDebatePrompt } from "./educationPrompts/debate/getDebatePrompt";
import { DebateSettings } from "@/store/debateSettingsStore";
import { getPsychologicalSupportPrompt } from "./learningPrompts/psychological-support/getPsychologicalSupportPrompt";
import { getDictationPrompt } from "./learningPrompts/dictation/getDictationPrompt";
import { getTranscriptionPrompt } from "./learningPrompts/transcription/getTranscriptionPrompt";
import { PsychologicalSettings } from "@/store/voiceSettingsStore";
import { SolutionSettings } from "@/store/solutionSettingsStore";
import { getSolutionPrompt } from "./learningPrompts/solution-book/getSolutionPrompt";
import { FlashcardsSettings } from "@/store/flashcardsSettingsStore";
import { getFlashcardsPrompt } from "./visualizations/flashcards/getFlashcardsPrompt";
import { GlossarySettings } from "@/store/glossarySettingsStore";
import { getGlossaryPrompt } from "./visualizations/glossary/getGlossaryPrompt";
import { getRoleplayPrompt } from "./visualizations/roleplay/getRoleplayPrompt";
import { RoleplaySettings } from "@/store/roleplaySettingsStore";
import { HierarchySettings } from "@/store/hierarchySettingsStore";
import { DictationSettings } from "@/store/dictationSettingsStore";
import { TranscriptionSettings } from "@/store/transcriptionSettingsStore";
import { CheatsheetsSettings } from "@/store/cheatsheetsSettingsStore";
import { getCheatsheetsPrompt } from "./learningPrompts/cheatsheets/getCheatsheetsPrompt";
import { ESSAY_PROMPT } from "./writingPrompts/essay/essayPrompt";
import { WritingSettings } from "@/store/writingSettingsStore";
import { getTestPrompt } from "./writingPrompts/test/getTestPrompt";
import { TestSettings } from "../user-dashboard/writing/types";
import { getWritingPrompt } from "./writingPrompts/writing/getWritingPrompt";
import { getTextbookPrompt } from "./writingPrompts/writing/textbook/getTextbookPrompt";

interface PromptBuilderParams {
  action?: "structure" | "article_part";
  isFullArticle?: boolean;
  mode?: string;
  generationSettings?: GenerationSettings;
  prompt?: string;
}

export function buildSystemPrompt({
  action,
  mode,
  generationSettings,
}: PromptBuilderParams): string {
  if (action) {
    switch (action) {
      case "structure":
        return getScientificArticleStructurePrompt(mode);
      case "article_part":
        return getFullScientificArticlePrompt(
          mode,
          generationSettings as ArticleSettings,
        );
      default:
        return getSystemPrompt(action);
    }
  }

  if (mode === "syllabus") {
    return getSyllabusPrompt(generationSettings as SyllabusSettings);
  }

  if (mode === "quiz") {
    return getQuizPrompt(generationSettings as QuizSettings);
  }

  if (mode === "lecture") {
    return getLecturePrompt(generationSettings as LectureSettings);
  }

  if (mode === "homework") {
    return getHomeworkPrompt(generationSettings as HomeworkSettings);
  }

  if (mode === "chat_education") {
    return CHAT_EDUCATION_PROMPT;
  }

  if (mode === "annotation") {
    return ANNOTATION_PROMPT;
  }

  if (mode === "practice") {
    return getPracticePrompt(generationSettings as PracticalSettings);
  }

  if (mode === "laboratory") {
    return getLaboratoryPrompt(generationSettings as LaboratorySettings);
  }

  if (mode === "interactive") {
    return getInteractivePrompt(generationSettings as InteractiveSettings);
  }

  if (mode === "project") {
    return getProjectPrompt(generationSettings as ProjectSettings);
  }

  if (mode === "credit") {
    return getCreditPrompt(generationSettings as CreditSettings);
  }

  if (mode === "exams") {
    return getExamsPrompt(generationSettings as ExamsSettings);
  }

  if (mode === "comparison") {
    return getComparisonPrompt(generationSettings as ComparisonSettings);
  }

  if (mode === "debate") {
    return getDebatePrompt(generationSettings as DebateSettings);
  }

  if (mode === "mindmap") {
    return getMindmapPrompt(generationSettings as MindmapSettings);
  }

  if (mode === "flowchart") {
    return getFlowchartPrompt(generationSettings as FlowchartSettings);
  }

  if (mode === "network") {
    return getNetworkPrompt(generationSettings as NetworkSettings);
  }

  if (mode === "barchart") {
    return getBarchartPrompt(generationSettings as BarchartSettings);
  }

  if (mode === "piechart") {
    return getPieChartPrompt(generationSettings as PieChartSettings);
  }

  if (mode === "radarchart") {
    return getRadarChartPrompt(generationSettings as RadarChartSettings);
  }

  if (mode === "linechart") {
    return getLineChartPrompt(generationSettings as LineChartSettings);
  }

  if (mode === "visualization_comparison") {
    return getComparisonTablePrompt(
      generationSettings as ComparisonTableSettings,
    );
  }

  if (mode === "roadmap") {
    return getRoadmapPrompt(generationSettings as RoadmapSettings);
  }

  if (mode === "hierarchy") {
    return getHierarchyPrompt(generationSettings as HierarchySettings);
  }

  if (mode === "timeline") {
    return getTimelinePrompt(generationSettings as TimelineSettings);
  }

  if (mode === "flashcards") {
    return getFlashcardsPrompt(generationSettings as FlashcardsSettings);
  }

  if (mode === "glossary") {
    return getGlossaryPrompt(generationSettings as GlossarySettings);
  }

  if (mode === "roleplay") {
    return getRoleplayPrompt(generationSettings as RoleplaySettings);
  }

  if (mode === "psychological_support") {
    return getPsychologicalSupportPrompt(
      generationSettings as PsychologicalSettings,
    );
  }

  if (mode === "solution_book") {
    return getSolutionPrompt(generationSettings as SolutionSettings);
  }

  if (mode === "cheatsheets") {
    return getCheatsheetsPrompt(generationSettings as CheatsheetsSettings);
  }

  if (mode === "dictation") {
    return getDictationPrompt(generationSettings as DictationSettings);
  }

  if (mode === "transcription") {
    return getTranscriptionPrompt(generationSettings as TranscriptionSettings);
  }

  if (mode === "essay") {
    return ESSAY_PROMPT;
  }

  if (mode === "textbooks") {
    return getTextbookPrompt(generationSettings as WritingSettings);
  }

  if (mode === "coursework" || mode === "report" || mode === "thesis") {
    return getWritingPrompt(
      mode as "textbooks" | "coursework" | "report" | "thesis",
      generationSettings as WritingSettings,
    );
  }

  if (mode === "test") {
    return getTestPrompt(generationSettings as TestSettings);
  }

  return getSystemPrompt(mode);
}
