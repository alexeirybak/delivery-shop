import { CategoryStatsProps } from "../../types";

const CategoryStats = ({
  totalArticles,
  currentPage,
  totalPages,
  articlesCount,
}: CategoryStatsProps) => {
  return (
    <div className="mt-8 p-4 flex flex-col md:flex-row justify-between items-center">
      <div className="text-gray-700 mb-4 md:mb-0">
        <span className="font-semibold">Найдено статей:</span>{" "}
        <span className="text-[#9674F9] font-bold">{totalArticles}</span>
      </div>
      <div className="text-gray-600 text-sm">
        Страница {currentPage} из {totalPages} • Показано {articlesCount} из{" "}
        {totalArticles}
      </div>
    </div>
  );
};

export default CategoryStats;
