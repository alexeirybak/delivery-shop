import fetchPurchases from "../fetchPurchases";
import ProductsSection from "@/components/ProductsSection";
import PaginationControls from "@/components/PaginationControls";

const AllPurchases = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  try {
    const purchases = await fetchPurchases();

    // Берем только продукты для текущей страницы
    const paginatedProducts = purchases.slice(
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

        {purchases.length > 3 && (
          <PaginationControls
            totalItems={purchases.length}
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

export default AllPurchases;
