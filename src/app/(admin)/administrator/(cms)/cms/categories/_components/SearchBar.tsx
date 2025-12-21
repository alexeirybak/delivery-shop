import { Search, X } from "lucide-react";
import { SearchBarProps } from "../../types/categories";



export const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Поиск...",
  isSearching = false,
}: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
    onSearch();
  };

  const handleSearch = () => {
    onSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        autoComplete="off"
      />
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer duration-300"
            title="Очистить поиск"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching} 
          className={`px-3 py-1 rounded hover:bg-green-700 text-sm cursor-pointer duration-300 ${
            isSearching
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-600 text-white"
          }`}
        >
          {isSearching ? "Поиск..." : "Найти"}
        </button>
      </div>
    </div>
  );
};