import { SortBy } from "../types";

export const getSortLabel = (value: SortBy): string => {
  const labels: Record<SortBy, string> = {
    createdAt: "По дате создания",
    updatedAt: "По дате обновления",
    title: "По названию",
    messages: "По сообщениям",
    favorite: "По избранному",
  };
  return labels[value];
};
