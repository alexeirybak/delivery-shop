import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { tableStyles } from "../../styles";

const NavAndInfo = ({totalUsers}: {totalUsers: number}) => {
  return (
    <div className={tableStyles.spacing.section}>
      <Link
        href="/administrator"
        className="hover:underline mb-3 lg:mb-4 flex flex-row items-center gap-3 text-sm lg:text-base"
      >
        <ArrowLeft className="h-4 w-4 ml-1" />
        Назад в панель управления
      </Link>
      <h1 className="text-lg lg:text-2xl font-bold mb-4">Список пользователей</h1>
      <p className="text-sm lg:text-base">Всего пользователей: {totalUsers}</p>
    </div>
  );
};

export default NavAndInfo;
