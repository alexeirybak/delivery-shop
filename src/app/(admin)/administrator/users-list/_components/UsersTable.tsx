"use client";

import { UserData } from "@/types/userData";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

interface UsersTableProps {
  users: UserData[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string, direction: "asc" | "desc") => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UsersTable = ({
  users,
  sortBy,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
}: UsersTableProps) => {
  return (
    <div className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden mt-4">
      <TableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      
      <div className="divide-y divide-gray-200 flex flex-col gap-y-5 border-b border-gray-200 pb-3">
        {users.map((user) => (
          <TableRow
            key={user.id}
            user={user}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UsersTable;