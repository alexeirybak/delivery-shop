import { fetchProductsByCategory } from "./fetchProducts";
import ProductsSection from "./ProductsSection";

const Actions = async () => {
  try {
    const products = await fetchProductsByCategory("actions");

    return (
      <ProductsSection
        title="Акции"
        viewAllButton={{ text: "Все акции", href: "actions" }}
        products={products}
        compact // Включаем адаптивное поведение 3/4 товара
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: Не удалось загрузить акции</div>
    );
  }
};

export default Actions;
