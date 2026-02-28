import { Search, Loader } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  loading: boolean;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const SearchInput = ({
  searchTerm,
  loading,
  onSearchTermChange,
  onSearch,
  onKeyPress,
}: SearchInputProps) => {
  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#]"
            size={20}
          />
          <input
            type="text"
            placeholder="Введите название товара или артикул..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={onKeyPress}
            className="w-full py-2 pl-10 pr-4 bg-white border rounded outline-none border-primary focus:shadow-button-default transition-custom"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading || searchTerm.trim().length < 3}
          className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-white rounded cursor-pointer bg-primary hover:shadow-button-default active:shadow-button-active transition-custom disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
          Найти
        </button>
      </div>

      <p className="mt-2 text-sm">
        {searchTerm.trim().length === 0 ? (
          <span className="text-main-text">
            Введите минимум 3 символа для поиска
          </span>
        ) : searchTerm.trim().length < 3 ? (
          <span className="text-[#ff6633]">
            Введите еще {3 - searchTerm.trim().length} символа для поиска
          </span>
        ) : (
          <span className="text-[#008c49]">✓ Можно выполнить поиск</span>
        )}
      </p>
    </div>
  );
};

export default SearchInput;
