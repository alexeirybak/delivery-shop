import { buttonStyles } from "@/app/styles";
import Link from "next/link";

const AdminProducts = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl text-main-text font-bold mb-6">
        Панель управления продуктами
      </h1>

      <div className="grid gap-4">
        <Link
          href="/administrator/users-list"
          className={`${buttonStyles.active} [&&]:justify-start px-4 py-2 w-full md:w-1/2`}
        >
          Управление пользователями
        </Link>
        <Link
          href="/administrator/products/add-product"
          className={`${buttonStyles.active} [&&]:justify-start px-4 py-2 w-full md:w-1/2`}
        >
          Добавление товара
        </Link>
        <Link
          href="/administrator/products/products-list"
          className={`${buttonStyles.active} [&&]:justify-start px-4 py-2 w-full md:w-1/2`}
        >
          Список товаров
        </Link>
        <Link
          href="/administrator/products/products-list"
          className={`${buttonStyles.active} [&&]:justify-start px-4 py-2 w-full md:w-1/2`}
        >
          Редактирование товара
        </Link>
      </div>
    </div>
  );
};

export default AdminProducts;
