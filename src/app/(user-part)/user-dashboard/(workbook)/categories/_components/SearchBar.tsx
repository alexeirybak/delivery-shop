import { Search, X } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import "../styles/search-bar.css";

export const SearchBar = () => {
  const {
    searchQuery,
    handleSearchChange,
    handleSearchClear,
    loadCategories,
    setCurrentPage,
  } = useCategoryStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value);
  };

  const handleClear = async () => {
    handleSearchClear();
    setCurrentPage(1);
    await loadCategories({ page: 1, search: "" });
  };

  const handleSearchClick = async () => {
    setCurrentPage(1);
    await loadCategories({ page: 1, search: searchQuery });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <div className="search-bar">
      <Search className="search-bar-icon" />
      <input
        type="text"
        placeholder="Поиск..."
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="search-bar-input"
        autoComplete="off"
      />
      <div className="search-bar-actions">
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="search-bar-clear-btn"
            title="Очистить поле поиска"
          >
            <X />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearchClick}
          className="search-bar-submit-btn"
        >
          Найти
        </button>
      </div>
    </div>
  );
};
