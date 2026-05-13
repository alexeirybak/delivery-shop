import { AIModel } from "../science/types";
import { SyllabusSettings } from "@/store/syllabusSettingsStore";
import { QuizSettings } from "@/store/quizSettingsStore";
import { ArticleSettings } from "@/store/scientificArticleSettingsStore";
import { LectureSettings } from "@/store/lectureSettingsStore";
import { HomeworkSettings } from "@/store/homeworkSettingsStore";
import { PracticalSettings } from "@/store/practicalSettingsStore";
import { LaboratorySettings } from "@/store/laboratorySettingsStore";
import { InteractiveSettings } from "@/store/interactiveSettingsStore";
import { ProjectSettings } from "@/store/projectSettingsStore";
import { ExamsSettings } from "@/store/examsSettingsStore";
import { CreditSettings } from "@/store/creditSettingsStore";
import { MindmapSettings } from "@/store/mindmapSettingsStore";
import { FlowchartSettings } from "@/store/flowchartSettingsStore";
import { NetworkSettings } from "@/store/networkSettingsStore";
import { BarchartSettings } from "@/store/barchartSettingsStore";
import { PieChartSettings } from "@/store/pieChartSettingsStore";
import { RadarChartSettings } from "@/store/radarChartSettingsStore";
import { LineChartSettings } from "@/store/lineChartSettingsStore";
import { ComparisonTableSettings } from "@/store/comparisonTableSettingsStore";
import { RoadmapSettings } from "@/store/roadmapSettingsStore";
import { TimelineSettings } from "@/store/timelineSettingsStore";
import { ComparisonSettings } from "@/store/comparisonSettingsStore";
import { DebateSettings } from "@/store/debateSettingsStore";
import { SolutionSettings } from "@/store/solutionSettingsStore";
import { DictationSettings } from "@/store/dictationSettingsStore";
import { HierarchySettings } from "@/store/hierarchySettingsStore";
import { PsychologicalSettings } from "@/store/voiceSettingsStore";
import { FlashcardsSettings } from "@/store/flashcardsSettingsStore";
import { GlossarySettings } from "@/store/glossarySettingsStore";
import { RoleplaySettings } from "@/store/roleplaySettingsStore";
import { CheatsheetsSettings } from "@/store/cheatsheetsSettingsStore";
import { WritingSettings } from "@/store/writingSettingsStore";
import { UploadedImage } from ".";

export type GenerationSettings =
  | ArticleSettings
  | SyllabusSettings
  | QuizSettings
  | LectureSettings
  | HomeworkSettings
  | PracticalSettings
  | LaboratorySettings
  | InteractiveSettings
  | ProjectSettings
  | CreditSettings
  | ExamsSettings
  | ComparisonSettings
  | DebateSettings
  | MindmapSettings
  | FlowchartSettings
  | NetworkSettings
  | BarchartSettings
  | PieChartSettings
  | RadarChartSettings
  | LineChartSettings
  | ComparisonTableSettings
  | RoadmapSettings
  | HierarchySettings
  | TimelineSettings
  | PsychologicalSettings
  | CheatsheetsSettings
  | DictationSettings
  | SolutionSettings
  | FlashcardsSettings
  | GlossarySettings
  | RoleplaySettings
  | WritingSettings;

export type GenerationMode =
  | "chat_education"
  | "syllabus"
  | "annotation"
  | "textbooks"
  | "essay"
  | "test"
  | "coursework"
  | "report"
  | "thesis"
  | "lecture"
  | "practice"
  | "laboratory"
  | "interactive"
  | "project"
  | "presentation"
  | "quiz"
  | "credit"
  | "exams"
  | "mindmap"
  | "flowchart"
  | "network"
  | "barchart"
  | "piechart"
  | "linechart"
  | "radarchart"
  | "comparison"
  | "roadmap"
  | "hierarchy"
  | "visualization_comparison"
  | "debate"
  | "homework_check"
  | "chat_learning"
  | "psychological_support"
  | "transcription"
  | "text_to_audio"
  | "solution_book"
  | "flashcards"
  | "glossary"
  | "workbook"
  | "portfolio"
  | "cheatsheets"
  | "dictation"
  | "chat_science"
  | "review"
  | "research"
  | "case"
  | "systematic"
  | "methodology"
  | "literature"
  | "conference"
  | "experimental"
  | "hypothesis"
  | "timeline"
  | "roleplay";

export interface SendMessageParams {
  prompt: string;
  action?: "structure" | "article_part";
  mode: string;
  signal: AbortSignal;
  isFullArticle?: boolean;
  metaType?: "structure" | "article_part";
  settings?: Partial<ArticleSettings>;
  model?: AIModel | string;
  generationSettings?: GenerationSettings;
  images?: UploadedImage[];
}
