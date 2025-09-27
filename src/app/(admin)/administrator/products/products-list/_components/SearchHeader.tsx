import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";



const SearchHeader = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-6 text-main-text">
        <Link
          href="/administrator"
          className="flex items-center gap-2 hover:underline"
        >
          <ArrowLeft size={20} />
          Назад в панель управления
        </Link>

        <Link
          href="/administrator/products/add-product"
          className="bg-primary hover:shadow-button-default active:shadow-button-active rounded text-white cursor-pointer duration-300 px-4 py-2 flex flex-row gap-2 items-center justify-center"
        >
          <Plus size={16} />
          Добавить товар
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Поиск товаров</h1>
    </>
  );
};

export default SearchHeader;
