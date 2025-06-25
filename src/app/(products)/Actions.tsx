import fetchProductsByCategory from "./fetchProducts";
import ProductsSection from "../../components/ProductsSection";
import { shuffleArray } from "../../../utils/shuffleArray";

const Actions = async () => {
  try {
    let products = await fetchProductsByCategory("actions");
    products = shuffleArray(products);

    return (
      <ProductsSection
        title="Акции"
        viewAllButton={{ text: "Все акции", href: "actions" }}
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

export default Actions;
