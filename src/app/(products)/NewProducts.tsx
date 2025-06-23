import { fetchProductsByCategory } from "./fetchProducts";
import ProductsSection from "./ProductsSection";

const NewProducts = async () => {
  try {
    const products = await fetchProductsByCategory("new");

    return (
      <ProductsSection
        title="Новинки"
        viewAllButton={{ text: "Все новинки", href: "new" }}
        products={products}
        compact // Включаем адаптивное поведение 3/4 товара
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: Не удалось загрузить новинки</div>
    );
  }
};

export default NewProducts;
