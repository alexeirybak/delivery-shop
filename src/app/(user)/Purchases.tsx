import fetchPurchases from "./fetchPurchases";
import ProductsSection from "../../components/ProductsSection";
import { CONFIG } from "../../../config/config";

const Purchases = async () => {
  try {
    const purchases = await fetchPurchases({ userPurchasesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS });

    return (
      <ProductsSection
        title="Покупали раньше"
        viewAllButton={{ text: "Все покупки", href: "purchases" }}
        products={purchases}
        compact
      />
    );
  } catch {
    return (
      <div className="text-red-500">
        Ошибка: не удалось загрузить Ваши покупки
      </div>
    );
  }
};

export default Purchases;
