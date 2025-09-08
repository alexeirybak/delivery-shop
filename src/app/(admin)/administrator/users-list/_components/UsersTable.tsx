"use client";

import { memo } from "react";
import { UserData } from "@/types/userData";
import Pagination from "./Pagination";
import TableHeader from "./TableHeader";
import UserId from "./UserId";
import Person from "./Person";
import Email from "./Email";
import Phone from "./Phone";
import Role from "./Role";
import Register from "./Register";
import Age from "./Age";

interface UsersTableProps {
  users: UserData[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRoleChange: () => void;
}

const UsersTable = memo(({
  users,
  sortBy,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  onRoleChange
}: UsersTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-4">
      <TableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSort}
      />

      <div className="divide-y divide-gray-200 flex flex-col gap-y-5 border-b border-gray-200 pb-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 px-3 py-1 duration-300 hover:bg-gray-50 hover:shadow-lg rounded-lg"
          >
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
            <Role
              role={user.role}
              userId={user.id}
              onRoleChange={onRoleChange}
            />
            <Register createdAt={user.createdAt} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});

UsersTable.displayName = "UsersTable";

export default UsersTable;