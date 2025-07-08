import fetchProductsByTag from "./fetchProducts";
import ProductsSection from "../../components/ProductsSection";
import { CONFIG } from "../../../config/config";
import ErrorComponent from "@/components/ErrorComponent";

const Actions = async () => {
  try {
    const { items } = await fetchProductsByTag("actions", {
      randomLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
    });

    return (
      <ProductsSection
        title="Акции"
        viewAllButton={{ text: "Все акции", href: "actions" }}
        products={items}
      />
    );
  } catch (error) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error : new Error(String(error))}
        userMessage="Не удалось загрузить акции"
      />
    );
  }
};

export default Actions;
