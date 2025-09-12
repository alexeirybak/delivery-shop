import { UserData } from "@/types/userData";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import Pagination from "./Pagination";

interface UsersTableProps {
  users: UserData[]; // Уже отсортированные с сервера
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void; // Упрощаем, direction определяется автоматически
}

const UsersTable = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  sortBy,
  sortDirection,
  onSort,
}: UsersTableProps) => {
  // УБИРАЕМ всю сортировку на фронтенде!
  // users уже отсортированы на сервере

  return (
    <div className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden mt-4">
      <TableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <div className="divide-y divide-gray-200 flex flex-col gap-y-5 border-b border-gray-200 pb-3">
        {users.map((user) => ( // Используем users, а не sortedUsers
          <TableRow key={user.id} user={user} />
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