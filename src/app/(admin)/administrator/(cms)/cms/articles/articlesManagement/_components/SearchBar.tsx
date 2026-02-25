import { Search, X } from "lucide-react";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";

export const SearchBar = () => {
  const {
    searchQuery,
    handleSearchChange,
    handleSearchClear,
    loadArticles,
    setCurrentPage,
  } = useArticlesManagementStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value);
  };

  const handleClear = async () => {
    handleSearchClear();
    setCurrentPage(1);
    await loadArticles({ page: 1, search: "" });
  };

  const handleSearchClick = async () => {
    setCurrentPage(1);
    await loadArticles({ page: 1, search: searchQuery });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Поиск..."
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        autoComplete="off"
      />
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-custom"
            title="Очистить поле поиска"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearchClick}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm cursor-pointer transition-custom"
        >
          Найти
        </button>
      </div>
    </div>
  );
};
