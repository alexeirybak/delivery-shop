import { ObjectId } from "mongodb";
import { GenerationMode } from "./generation.types";
import { UploadedImage } from "./upload.types";
import { ArticleStatus } from "../science/types";

import {
  ChartData,
  FlowchartNode,
  MindMapNode,
  NetworkGraph,
  PieChartData,
  RadarChartData,
  LineChartData,
  ComparisonTableData,
  RoadmapData,
  TimelineData,
  FlashcardData,
  GlossaryData,
  RoleplayScenario,
} from "../visualizations/types";

export interface MessageMeta {
  type:
    | "structure"
    | "article_part"
    | "full_article"
    | "mindmap"
    | "flowchart"
    | "network"
    | "barchart"
    | "piechart"
    | "linechart"
    | "radarchart"
    | "visualization_comparison"
    | "roadmap"
    | "hierarchy"
    | "timeline"
    | "flashcards"
    | "glossary"
    | "roleplay";
  isDraft?: boolean;
  isError?: boolean;
  isAborted?: boolean;
  errorType?: string;
  hasError?: boolean;
  jsonData?:
    | MindMapNode
    | FlowchartNode
    | NetworkGraph
    | ChartData
    | PieChartData
    | RadarChartData
    | LineChartData
    | ComparisonTableData
    | RoadmapData
    | TimelineData
    | FlashcardData
    | GlossaryData
    | RoleplayScenario;
}

export interface Message {
  id: string;
  tempId?: string;
  _id?: string;
  chatId?: string;
  role: "user" | "assistant";
  images?: UploadedImage[];
  content: string;
  isStructure?: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  mode?: GenerationMode;
  meta?: MessageMeta;
  audioUrl?: string;
}

export interface Chat {
  _id: ObjectId;
  userId: string;
  title: string;
  mode: GenerationMode;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export interface SavedChat {
  id: string;
  title: string;
  mode: string;
  messagesCount: number;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  mode: string;
  messagesCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: string;
  matchedMessages?: {
    id: string;
    content: string;
    timestamp: Date;
  }[];
}

export interface ChatData {
  id: string;
  mode: GenerationMode;
  messages: Message[];
  title?: string;
  articleStatus?: ArticleStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoadedChat {
  messages: Message[];
  mode: GenerationMode;
  articleStatus?: ArticleStatus;
}
