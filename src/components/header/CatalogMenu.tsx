import Link from "next/link";
import SearchBlock from "./SearchBlock";
import { CatalogMenuProps } from "@/types/catalogMenuProps";

export const CatalogMenu = ({
  isCatalogOpen,
  isLoading,
  categories,
  searchBlockRef,
  menuRef,
  onFocusChangeAction,
  setIsCatalogOpen,
  onMouseEnter,
}: CatalogMenuProps) => (
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
        className="hidden md:block absolute top-full left-0 w-full bg-white shadow-(--shadow-catalog-menu) z-50"
      >
        <div className="mx-auto px-4 py-3">
          {isLoading ? (
            <div className="py-2 text-center">Загрузка...</div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="block px-4 py-2 text-[#414141] hover:text-[#ff6633] font-bold duration-300"
                  onClick={() => setIsCatalogOpen(false)}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-2 text-center">Нет доступных категорий</div>
          )}
        </div>
      </div>
    )}
  </>
);
