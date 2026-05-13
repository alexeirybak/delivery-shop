import { useState } from "react";
import { AIModel, UseModelSelectionReturn } from "../types";

const STORAGE_KEY = "selected_ai_model";

const getSavedModel = (): AIModel => {
  if (typeof window === "undefined") return "deepseek";

  const savedModel = localStorage.getItem(STORAGE_KEY) as AIModel;
  if (savedModel && (savedModel === "deepseek" || savedModel === "qwen")) {
    return savedModel;
  }
  return "deepseek";
};

export const useModelSelection = (): UseModelSelectionReturn => {
  const [model, setModel] = useState<AIModel>(getSavedModel);

  const handleSetModel = (newModel: AIModel) => {
    setModel(newModel);
    localStorage.setItem(STORAGE_KEY, newModel);
  };

  return {
    model,
    setModel: handleSetModel,
    isQwen: model === "qwen",
    isDeepseek: model === "deepseek",
  };
};
