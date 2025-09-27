import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const EditProductHeader = () => {
  return (
    <div className="container flex flex-col items-center px-4 py-8 text-main-text mx-auto">
      <Link
        href="/administrator/products/products-list"
        className="hover:underline mb-3 lg:mb-4 flex flex-row items-center gap-3 text-sm lg:text-base"
      >
        <ArrowLeft className="h-4 w-4 ml-1" />
        Для редактирования найдите товары
      </Link>
      <h1 className="text-3xl font-bold mb-8">Редактировать товар</h1>
    </div>
  );
};

export default EditProductHeader;
