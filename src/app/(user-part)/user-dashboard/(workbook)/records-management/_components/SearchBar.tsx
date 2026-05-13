import { Search, X } from "lucide-react";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import "./../styles/search-bar.css";

export const SearchBar = () => {
  const {
    searchQuery,
    handleSearchChange,
    handleSearchClear,
    loadRecords,
    setCurrentPage,
  } = useRecordsManagementStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value);
  };

  const handleClear = async () => {
    handleSearchClear();
    setCurrentPage(1);
    await loadRecords({ page: 1, search: "" });
  };

  const handleSearchClick = async () => {
    setCurrentPage(1);
    await loadRecords({ page: 1, search: searchQuery });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <div className="search-bar-container">
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
            className="search-bar-clear"
            title="Очистить поле поиска"
          >
            <X className="search-bar-clear-icon" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearchClick}
          className="search-bar-button"
        >
          Найти
        </button>
      </div>
    </div>
  );
};