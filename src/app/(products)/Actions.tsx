import fetchProductsByCategory from "./fetchProducts";
import ProductsSection from "../../components/ProductsSection";
import { CONFIG } from "../../../config/config";

const Actions = async () => {
  try {
    const products = await fetchProductsByCategory("actions", { randomLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS });
    
    return (
      <ProductsSection
        title="Акции"
        viewAllButton={{ text: "Все акции", href: "actions" }}
        products={products}
        compact
      />
    );
  } catch {
    return <div className="text-red-500">Ошибка: не удалось загрузить акции</div>;
  }
};

export default Actions;
