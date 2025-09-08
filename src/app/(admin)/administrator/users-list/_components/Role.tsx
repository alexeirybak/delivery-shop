"use client";

import { useState, useEffect } from "react";
import { tableStyles } from "../../styles";
import MiniLoader from "@/components/MiniLoader";
import { UserRole } from "@/types/userData";

interface RoleProps {
  role: string;
  userId: string;
  onRoleChange?: () => void;
}

const Role = ({ role, userId, onRoleChange }: RoleProps) => {
  const [isChanging, setIsChanging] = useState(false);
  const [localRole, setLocalRole] = useState<UserRole>(role as UserRole);

  // Синхронизируем локальное состояние с пропсом role при изменении
  useEffect(() => {
    setLocalRole(role as UserRole);
  }, [role]);

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === localRole) return;

    setIsChanging(true);
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось сменить роль");
      }

      // Немедленно обновляем локальное состояние для мгновенного отображения
      setLocalRole(newRole);
      
      if (onRoleChange) {
        onRoleChange();
      }
    } catch (error) {
      console.error("Ошибка при смене роли:", error);
      // Возвращаем предыдущую роль в случае ошибки
      setLocalRole(role as UserRole);
      alert(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при смене роли"
      );
    } finally {
      setIsChanging(false);
    }
  };

  const getRoleStyles = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-[#ffc7c7] text-[#d80000]";
      case "manager":
        return "bg-[#e5ffde] text-[#008c48]";
      default:
        return "bg-[#f3f2f1] text-[#414141]";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "manager":
        return "Менеджер";
      default:
        return "Пользователь";
    }
  };

  return (
    <div
      className={`border-b border-gray-300 md:border-b-0 order-6 flex flex-row gap-x-3 ${tableStyles.colSpans.role} ${tableStyles.border.right}`}
    >
      <div className="text-xs font-semibold md:hidden">Роль:</div>

      {isChanging ? (
        <div className="text-xs text-gray-500">
          <MiniLoader />
        </div>
      ) : localRole === "admin" ? (
        <div
          className={`inline-flex justify-center items-center h-8 md:flex-1 w-30 rounded text-xs font-medium px-1 ${getRoleStyles(localRole)}`}
        >
          {getRoleLabel(localRole)}
        </div>
      ) : (
        <select
          value={localRole}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          className={`inline-flex justify-center items-center h-8 md:flex-1 w-30 p-2 rounded text-xs font-medium cursor-pointer outline-none ${getRoleStyles(localRole)}`}
          disabled={isChanging}
        >
          <option value="user">Пользователь</option>
          <option value="manager">Менеджер</option>
          <option value="admin">Администратор</option>
        </select>
      )}
    </div>
  );
};

export default Role;