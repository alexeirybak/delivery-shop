import { UserRole } from "@/types/userData";

export const getDeleteButtonTitle = (
  currentUserId: string,
  currentUserRole: UserRole,
  authorId: string,
): string => {
  if (currentUserId === authorId) return "Удалить свой комментарий";
  if (currentUserRole === "admin") return "Удалить комментарий (Админ)";
  if (currentUserRole === "manager") return "Удалить комментарий (Менеджер)";
  return "Удалить комментарий";
};
