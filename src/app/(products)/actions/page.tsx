import fetchProductsByCategory from "../fetchProducts";
import ProductsSection from "../../../components/ProductsSection";

export const metadata = {
  title: 'Акции магазина "Северяночка"',
  description: 'Акционные товары магазина "Северяночка"',
};

const AllActions = async () => {
  try {
    const products = await fetchProductsByCategory("actions");

    return (
      <ProductsSection
        title="Все акции"
        viewAllButton={{ text: "На главную", href: "/" }}
        products={products}
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: не удалось загрузить акции</div>
    );
  }
};

export default AllActions;
