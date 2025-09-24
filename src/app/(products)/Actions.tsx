import fetchProductsByTag from "./fetchProducts";
import ProductsSection from "../../components/ProductsSection";
import { CONFIG } from "../../../config/config";
import ErrorComponent from "@/components/ErrorComponent";

interface ActionsProps {
  randomLimit?: number;
  mobileItemsLimit?: number;
}

const Actions = async ({
  randomLimit = CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
  mobileItemsLimit = 4, // По умолчанию 4
}: ActionsProps) => {
  try {
    const { items } = await fetchProductsByTag("actions", {
      randomLimit,
    });

    return (
      <ProductsSection
        title="Акции"
        viewAllButton={{ text: "Все акции", href: "actions" }}
        products={items}
        mobileItemsLimit={mobileItemsLimit} // Просто число
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
