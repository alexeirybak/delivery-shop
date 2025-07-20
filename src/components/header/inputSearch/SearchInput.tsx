import Image from "next/image";
import { SearchInputProps } from "@/types/searchInputProps";
import iconSearch from "/public/icons-header/icon-search.svg";

const SearchInput = ({
  query,
  setQuery,
  handleSearch,
  handleInputFocus,
  handleInputBlur,
}: SearchInputProps) => {
  return (
    <div className="relative rounded border-1 border-(--color-primary) shadow-(--shadow-button-default) leading-[150%]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="text"
          value={query}
          placeholder="Найти товар"
          className="w-full h-10 p-2 outline-none text-[#8f8f8f] text-base caret-(--color-primary)"
          onFocus={handleInputFocus}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={handleInputBlur}
        />
        <button
          className="absolute top-2 right-2 w-6 h-6 cursor-pointer"
          type="submit"
        >
          <Image src={iconSearch} alt="Поиск" width={24} height={24} />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
