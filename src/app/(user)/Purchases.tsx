import { fetchPurchases } from "./fetchPurchases";
import ProductsSection from "../(products)/ProductsSection";

const Actions = async () => {
  try {
    const products = await fetchPurchases();

    return (
      <ProductsSection
        title="Покупали раньше"
        viewAllButton={{ text: "Все покупки", href: "purchases" }}
        products={products}
        compact // Включаем адаптивное поведение 3/4 товара
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: Не удалось загрузить покупки</div>
    );
  }
};

export default Actions;
