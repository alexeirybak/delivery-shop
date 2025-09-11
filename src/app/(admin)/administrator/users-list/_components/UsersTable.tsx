import { UserData } from "@/types/userData";
import TableRow from "./TableRow";

interface UsersTableProps {
  users: UserData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UsersTable = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
}: UsersTableProps) => {
  return (
    <div className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden mt-4">
      <div className="divide-y divide-gray-200 flex flex-col gap-y-5 border-b border-gray-200 pb-3">
        {users.map((user) => (
          <TableRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersTable;
