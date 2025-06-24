import fetchProductsByCategory from "../fetchProducts";
import ProductsSection from "../../../components/ProductsSection";
import { CONFIG } from "@/config/config";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";

export const metadata = {
  title: 'Акции магазина "Северяночка"',
  description: 'Акционные товары магазина "Северяночка"',
};

const AllActions = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}) => {
  // Декструктурируем после await
  const params = await searchParams;
  const page = params?.page;
  const itemsPerPage = params?.itemsPerPage || CONFIG.ITEMS_PER_PAGE;

  const currentPage = Number(page) || 1;
  const perPage = Number(itemsPerPage);

  const startIdx = (currentPage - 1) * perPage;

  try {
    const allProducts = await fetchProductsByCategory("actions");
    const freshProductArray = allProducts;

    const products = freshProductArray.slice(startIdx, startIdx + perPage);

    return (
      <>
        <ProductsSection
          title="Все акции"
          viewAllButton={{ text: "На главную", href: "/" }}
          products={products}
        />
        {allProducts.length > perPage && (
          <ClientPaginationWrapper
            totalItems={allProducts.length}
            currentPage={currentPage}
            basePath="/actions"
            initialItemsPerPage={perPage}
          />
        )}
      </>
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: не удалось загрузить акции</div>
    );
  }
};

export default AllActions;
