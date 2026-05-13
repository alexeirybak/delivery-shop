export type ActionType =
  | "generate"
  | "education"
  | "science"
  | "improve"
  | "simplify"
  | "summarize";

export type SystemPromptsMap = Record<ActionType, string>;
