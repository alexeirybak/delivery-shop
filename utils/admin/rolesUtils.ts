import { UserRole } from "@/types/userData";

export const getRoleStyles = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-[#ffc7c7] text-[#d80000]";
      case "manager":
        return "bg-[#e5ffde] text-[#008c48]";
      default:
        return "bg-[#f3f2f1] text-[#414141]";
    }
  };

  export const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "manager":
        return "Менеджер";
      default:
        return "Пользователь";
    }
  };