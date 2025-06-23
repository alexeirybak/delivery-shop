import { fetchProductsByCategory } from "../fetchProducts";
import ProductsSection from "../ProductsSection";
const AllActions = async () => {
  try {
    const products = await fetchProductsByCategory("actions");

    return (
      <ProductsSection
        title="Все акции"
        viewAllButton={{ text: "На главную", href: "/" }}
        products={products} // Без compact - выводятся все товары
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: Не удалось загрузить акции</div>
    );
  }
};

export default AllActions;
