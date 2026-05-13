import { GenerationMode } from "../../../types";

export interface ArticleModeConfig {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  description: string;
}

export type ScienceMode = Extract<
  GenerationMode,
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
>;

