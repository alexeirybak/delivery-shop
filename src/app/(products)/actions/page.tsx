import fetchProductsByCategory from "../fetchProducts";
import ProductsSection from "../../../components/ProductsSection";
import PaginationControls from "@/components/PaginationControls";

export const metadata = {
  title: 'Акции магазина "Северяночка"',
  description: 'Акционные товары магазина "Северяночка"',
};

const AllActions = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  try {
    const products = await fetchProductsByCategory("actions");

    // Берем только продукты для текущей страницы
    const paginatedProducts = products.slice(
      (currentPage - 1) * 3,
      currentPage * 3
    );

    return (
      <div>
        <ProductsSection
          title="Все покупки"
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
    return <div className="text-red-500">Ошибка загрузки покупок</div>;
  }
};

export default AllActions;
