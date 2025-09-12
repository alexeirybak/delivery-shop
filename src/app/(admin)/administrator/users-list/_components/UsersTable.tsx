import { UserData } from "@/types/userData";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import { getShortDecimalId } from "../../../../../../utils/admin/shortDecimalId";
import { calculateAge } from "../../../../../../utils/admin/calculateAge";

interface UsersTableProps {
  users: UserData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string, direction: "asc" | "desc") => void;
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
  let sortedUsers = users;

  if (sortBy === "id") {
    sortedUsers = [...users].sort((a, b) => {
      const decimalA = parseInt(getShortDecimalId(a.id));
      const decimalB = parseInt(getShortDecimalId(b.id));

      return sortDirection === "asc"
        ? decimalA - decimalB
        : decimalB - decimalA;
    });
  }

  if (sortBy === "age") {
    sortedUsers = [...users].sort((a, b) => {
      const ageA = parseInt(calculateAge(a.birthdayDate).toString());
      const ageB = parseInt(calculateAge(b.birthdayDate).toString());

      return sortDirection === "asc" ? ageA - ageB : ageB - ageA;
    });
  }
  return (
    <div className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden mt-4">
      <TableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <div className="divide-y divide-gray-200 flex flex-col gap-y-5 border-b border-gray-200 pb-3">
        {sortedUsers.map((user) => (
          <TableRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersTable;
