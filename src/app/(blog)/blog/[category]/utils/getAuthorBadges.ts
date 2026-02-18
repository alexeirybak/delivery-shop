import { IComment } from "../../types/comments.types";

export const getAuthorBadges = (comment: IComment) => {
  const badges = [];

  if (comment.authorRole === "admin") {
    badges.push({
      text: "Админ",
      className: "bg-red-100 text-red-700 border border-red-200",
    });
  } else if (comment.authorRole === "manager") {
    badges.push({
      text: "Менеджер",
      className: "bg-green-100 text-green-700 border border-green-200",
    });
  }
  return badges;
};
