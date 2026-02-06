import { ArticleStatus } from "../types";

export const getStatusStyles = (status: ArticleStatus) => {
  switch (status) {
    case "published":
      return {
        className: "bg-green-100 text-green-800 border-green-200",
        label: "Опубликована",
      };
    case "draft":
      return {
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Черновик",
      };
    case "archived":
      return {
        className: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Архив",
      };
    case "deleted":
      return {
        className: "bg-red-100 text-red-800 border-red-200",
        label: "Удалена",
      };
    default:
      return {
        className: "bg-gray-100 text-gray-800 border-gray-200",
        label: status,
      };
  }
};