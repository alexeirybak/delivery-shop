import { CollectionType } from "../types";

export const collectionTypes: { id: CollectionType; label: string }[] = [
  { id: "all", label: "Все типы" },
  { id: "education", label: "Обучение" },
  { id: "learning", label: "Изучение" },
  { id: "scientific-articles", label: "Научные статьи" },
  { id: "visualizations", label: "Визуализации" },
  { id: "writing", label: "Письменные работы" },
  { id: "audio", label: "Аудио" },
];