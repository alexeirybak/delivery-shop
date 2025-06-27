import fetchProductsByCategory from "./fetchProducts";
import ProductsSection from "../../components/ProductsSection";
import { shuffleArray } from "../../../utils/shuffleArray";

const NewProducts = async () => {
  try {
    let products = await fetchProductsByCategory("new");
    products = shuffleArray(products);
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
