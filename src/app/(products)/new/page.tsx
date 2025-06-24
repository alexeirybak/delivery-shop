import ProductsSection from "@/components/ProductsSection";
import fetchProductsByCategory from "../fetchProducts";
import PaginationControls from "@/components/PaginationControls";

export const metadata = {
  title: 'Новинки магазина "Северяночка"',
  description: 'Новые товары магазина "Северяночка"',
};


const AllNew = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  try {
    const products = await fetchProductsByCategory("new");
    // Берем только продукты для текущей страницы
    const paginatedProducts = products.slice(
      (currentPage - 1) * 3,
      currentPage * 3
    );

    return (
      <div>
        <ProductsSection
          title="Все новинки"
          viewAllButton={{ text: "На главную", href: "/" }}
          products={paginatedProducts}
        />

        {products.length > 3 && (
          <PaginationControls
            totalItems={products.length}
            currentPage={currentPage}
            itemsPerPage={3}
          />
        )}
      </div>
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: не удалось загрузить акции</div>
    );
  }
};

export default AllNew;
