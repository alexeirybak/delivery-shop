export type AIModel = "deepseek" | "qwen";

export interface UseModelSelectionReturn {
  model: AIModel;
  setModel: (model: AIModel) => void;
  isQwen: boolean;
  isDeepseek: boolean;
}

export interface ScientificArticleSettingsPanelProps {
  model: AIModel;
  onModelChange: (model: AIModel) => void;
}
