"use client";

import { useState, useEffect } from "react";
import { tableStyles } from "../../styles";
import MiniLoader from "@/components/MiniLoader";
import { UserRole } from "@/types/userData";
import { useAuthStore } from "@/store/authStore";

interface RoleProps {
  role: string;
  onRoleChange: (newRole: string) => Promise<void>;
}

const Role = ({ role, onRoleChange }: RoleProps) => {
  const [isChanging, setIsChanging] = useState(false);
  const [localRole, setLocalRole] = useState<UserRole>(role as UserRole);
  const { user: currentUser } = useAuthStore();
  
  const isAdmin = currentUser?.role === 'admin';
  const canChangeRole = isAdmin; // Только админы могут менять роли

  // Синхронизируем локальное состояние с пропсом role при изменении
  useEffect(() => {
    setLocalRole(role as UserRole);
  }, [role]);

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === localRole || !canChangeRole) return;

    setIsChanging(true);
    try {
      // Вызываем функцию из props для обновления роли
      await onRoleChange(newRole);
      
      // Обновляем локальное состояние после успешного изменения
      setLocalRole(newRole);
    } catch (error) {
      console.error("Ошибка при смене роли:", error);
      // Возвращаем предыдущую роль в случае ошибки
      setLocalRole(role as UserRole);
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
          className={`inline-flex justify-center items-center h-8 md:flex-1 w-35 md:w-30 rounded font-medium px-3 md:px-1 lg:px-3 py-2 text-xs md:text-[10px] lg:text-xs ${getRoleStyles(localRole)}`}
        >
          {getRoleLabel(localRole)}
        </div>
      ) : canChangeRole ? (
        <select
          value={localRole}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          className={`inline-flex justify-center items-center h-8 md:flex-1 w-35 ma:w-30 px-3 md:px-1 lg:px-3 py-2 rounded text-xs md:text-[10px] lg:text-xs font-medium cursor-pointer outline-none ${getRoleStyles(localRole)}`}
          disabled={isChanging}
        >
          <option value="user">Пользователь</option>
          <option value="manager">Менеджер</option>
        </select>
      ) : (
        <div
          className={`inline-flex justify-center items-center h-8 md:flex-1 w-35 md:w-30 rounded font-medium px-3 md:px-1 lg:px-3 py-2 text-xs md:text-[10px] lg:text-xs ${getRoleStyles(localRole)}`}
        >
          {getRoleLabel(localRole)}
        </div>
      )}
    </div>
  );
};

export default Role;