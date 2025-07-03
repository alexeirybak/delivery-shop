import fetchProductsByTag from "./fetchProducts";
import ProductsSection from "../../components/ProductsSection";
import { CONFIG } from "../../../config/config";

const NewProducts = async () => {
  try {
    const {items} = await fetchProductsByTag("new", {
      randomLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
    });
    return (
      <ProductsSection
        title="Новинки"
        viewAllButton={{ text: "Все новинки", href: "new" }}
        products={items}
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: не удалось загрузить новинки</div>
    );
  }
};

export default NewProducts;
