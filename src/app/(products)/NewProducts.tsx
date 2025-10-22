import fetchProductsByTag from "./fetchProducts";
import ProductsSection from "../../components/ProductsSection";
import { CONFIG } from "../../../config/config";
import ErrorComponent from "@/components/ErrorComponent";

const NewProducts = async () => {
  try {
    const { items } = await fetchProductsByTag("new", {
      pagination: { startIdx: 0, perPage: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS },
    });
    return (
      <ProductsSection
        title="Новинки"
        viewAllButton={{ text: "Все новинки", href: "new" }}
        products={items}
      />
    );
  } catch (error) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error : new Error(String(error))}
        userMessage="Не удалось загрузить новинки"
      />
    );
  }
};

export default NewProducts;
