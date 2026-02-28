import ErrorComponent from "@/components/ErrorComponent";
import MiniLoader from "@/components/MiniLoader";
import { CatalogMenuProps } from "@/types/catalogMenuProps";
import Link from "next/link";
import SearchBlock from "../SearchBlock";

const CatalogMenu = ({
  isLoading,
  isCatalogOpen,
  setIsCatalogOpen,
  categories,
  searchBlockRef,
  menuRef,
  error,
  onMouseEnter,
  onFocusChangeAction,
}: CatalogMenuProps) => {
  return (
    <>
      <div
        className="flex items-center w-full"
        onMouseEnter={onMouseEnter}
        ref={searchBlockRef}
      >
        <SearchBlock onFocusChangeAction={onFocusChangeAction} />
      </div>

      {isCatalogOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 z-50 hidden w-full bg-white md:block top-full shadow-catalog-menu"
        >
          <div className="px-4 py-3 mx-auto">
            {error && (
              <ErrorComponent
                error={error.error}
                userMessage={error.userMessage}
              />
            )}
            {isLoading ? (
              <MiniLoader />
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/catalog/${category.slug}`}
                    className="block px-4 py-2 text-main-text hover:text-[#ff6633] font-bold transition-custom"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="py-2 text-center">Нет доступных категорий</div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CatalogMenu;
