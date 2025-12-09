import { ArticleStatus } from "../types/articleStatus";

export const getStatusText = (status: ArticleStatus): string => {
  switch (status) {
    case "published":
      return "Опубликовано";
    case "draft":
      return "Черновик";
    case "archived":
      return "В архиве";
    case "deleted":
      return "Удалено";
    default:
      return "Неизвестно";
  }
};
