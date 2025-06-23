import { fetchPurchases } from "../fetchPurchases";
import ProductsSection from "@/app/(products)/ProductsSection";

const AllPurchases = async () => {
  try {
    const products = await fetchPurchases();

    return (
      <ProductsSection
        title="Все покупки"
        viewAllButton={{ text: "На главную", href: "/" }}
        products={products} // Без compact - выводятся все товары
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: Не удалось загрузить акции</div>
    );
  }
};

export default AllPurchases;
