import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { tableStyles } from "../../styles";

interface NavAndInfoProps {
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (size: number) => void;
  totalUsers: number;
}

const NavAndInfo = ({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  totalUsers,
}: NavAndInfoProps) => {
  return (
    <div className={tableStyles.spacing.section}>
      <Link
        href="/administrator"
        className="hover:underline mb-3 lg:mb-4 flex flex-row items-center gap-3 text-sm lg:text-base"
      >
        <ArrowLeft className="h-4 w-4 ml-1" />
        Назад в панель управления
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold mb-2">
            Список пользователей
          </h1>
          <p className="text-sm lg:text-base">
            Всего пользователей: {totalUsers}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-sm text-gray-600 whitespace-nowrap"
          >
            Пользователей на странице:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default NavAndInfo;
