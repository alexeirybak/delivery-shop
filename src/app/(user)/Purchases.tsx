import fetchPurchases from "./fetchPurchases";
import ProductsSection from "../../components/ProductsSection";

const Purchases = async () => {
  try {
    const purchases = await fetchPurchases();

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
