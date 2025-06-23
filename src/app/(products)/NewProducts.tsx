import fetchProductsByCategory from "./fetchProducts";
import ProductsSection from "../../components/ProductsSection";

const NewProducts = async () => {
  try {
    const products = await fetchProductsByCategory("new");

    return (
      <ProductsSection
        title="Новинки"
        viewAllButton={{ text: "Все новинки", href: "new" }}
        products={products}
        compact
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: не удалось загрузить акции</div>
    );
  }
};

export default NewProducts;
