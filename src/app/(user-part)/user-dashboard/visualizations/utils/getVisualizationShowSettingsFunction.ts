import { GenerationMode } from "../../types";

type ShowSettingsFunction = () => void;

type ModeWithSettings = Extract<
  GenerationMode,
  | "mindmap"
  | "flowchart"
  | "network"
  | "barchart"
  | "piechart"
  | "radarchart"
  | "linechart"
  | "visualization_comparison"
  | "roadmap"
  | "hierarchy"
  | "timeline"
  | "flashcards"
  | "glossary"
  | "ropleplay"
>;

export function getVisualizationShowSettingsFunction(
  mode: GenerationMode,
  showFunctions: Record<ModeWithSettings, ShowSettingsFunction>,
): ShowSettingsFunction | undefined {
  if (mode in showFunctions) {
    return showFunctions[mode as ModeWithSettings];
  }
  return undefined;
}
