import fetchProductsByCategory from "../fetchProducts";
import ProductsSection from "../../../components/ProductsSection";

export const metadata = {
  title: 'Новинки магазина "Северяночка"',
  description: 'Новые товары магазина "Северяночка"',
};

const AllNew = async () => {
  try {
    const products = await fetchProductsByCategory("new");

    return (
      <ProductsSection
        title="Все новинки"
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

export default AllNew;
