"use client";

import { useState } from "react";
import { UserData } from "@/types/userData";
import UserId from "./UserId";
import Person from "./Person";
import Age from "./Age";
import Email from "./Email";
import Phone from "./Phone";
import Role from "./Role";
import Register from "./Register";

interface TableRowProps {
  user: UserData;
}

const TableRow = ({ user}: TableRowProps) => {
  const [currentRole, setCurrentRole] = useState<string>(user.role);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return;

    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении роли");
      }

      const data = await response.json();

      if (data.success) {
        setCurrentRole(newRole);
      } else {
        throw new Error(data.error || "Неизвестная ошибка");
      }
    } catch (error) {
      console.error("Ошибка при обновлении роли:", error);
      setCurrentRole(user.role);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 px-3 py-1 duration-300 hover:bg-gray-50 hover:shadow-lg rounded-lg">
      <UserId userId={user.id} />
      <Person
        name={user.name}
        surname={user.surname}
        birthday={user.birthdayDate}
      />
      <Age birthdayDate={user.birthdayDate} />
      <Email email={user.email} emailVerified={user.emailVerified} />
      <Phone
        phone={user.phoneNumber}
        phoneVerified={user.phoneNumberVerified}
      />
      <Role role={currentRole} onRoleChange={handleRoleChange} />
      <Register createdAt={user.createdAt} />
    </div>
  );
};

export default TableRow;