import Image from "next/image";
import Link from "next/link";
import iconBurger from "/public/icons-header/icon-burger-menu.svg";
import { TRANSLATIONS } from "../../../../utils/translations";
import HighlightText from "../HighlightText";
import MiniLoader from "../../MiniLoader";
import { SearchResultsProps } from "@/types/searchResultsProps";

const SearchResults = ({
  isLoading,
  query,
  groupedProducts,
  resetSearch,
}: SearchResultsProps) => {
  if (isLoading) return <MiniLoader />;

  if (groupedProducts.length > 0) {
    return (
      <div className="p-2 flex flex-col gap-2 text-[#414141]">
        {groupedProducts.map((group) => (
          <div key={group.category} className="flex flex-col gap-2">
            <Link
              href={`/category/${encodeURIComponent(group.category)}`}
              className="flex items-start gap-x-4 hover:bg-gray-100 p-1 rounded cursor-pointer"
              onClick={resetSearch}
            >
              <div>
                <HighlightText
                  text={TRANSLATIONS[group.category] || group.category}
                  highlight={query}
                />
              </div>
              <Image
                src={iconBurger}
                alt={TRANSLATIONS[group.category] || group.category}
                width={24}
                height={24}
                className="flex-shrink-0"
              />
            </Link>
            <ul className="flex flex-col gap-2">
              {group.products.map((product) => (
                <li key={product.id} className="p-1 hover:bg-gray-100">
                  <Link
                    href={`/product/${product.id}`}
                    className="cursor-pointer"
                    onClick={resetSearch}
                  >
                    <HighlightText text={product.title} highlight={query} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (query.length > 1) {
    return <div className="text-[#8f8f8f] py-2 px-4">Ничего не найдено</div>;
  }

  return (
    <div className="p-4 text-[#8f8f8f]">
      Введите 2 и более символов для поиска
    </div>
  );
};

export default SearchResults;
