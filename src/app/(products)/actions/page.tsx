// Импорт функции для получения товаров по категории
import fetchProductsByCategory from "../fetchProducts";
// Импорт компонента для отображения секции товаров
import ProductsSection from "../../../components/ProductsSection";
// Импорт конфигурации (содержит настройки, например ITEMS_PER_PAGE)
import { CONFIG } from "@/config/config";
// Импорт компонента-обертки для клиентской пагинации
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";

// Метаданные для SEO
export const metadata = {
  title: 'Акции магазина "Северяночка"',
  description: 'Акционные товары магазина "Северяночка"',
};

// Основной компонент страницы акций
const AllActions = async ({
  searchParams, // Параметры URL (page, itemsPerPage)
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}) => {
  // Получаем параметры из URL (асинхронно)
  const params = await searchParams;
  const page = params?.page; // Номер текущей страницы из URL
  // Количество элементов на странице из URL или из конфига
  const itemsPerPage = params?.itemsPerPage || CONFIG.ITEMS_PER_PAGE;

  // Преобразуем параметры в числа (по умолчанию 1я страница)
  const currentPage = Number(page) || 1;
  const perPage = Number(itemsPerPage);

  // Вычисляем начальный индекс для пагинации
  // Например, для страницы 3 и 10 элементов: (3-1)*10 = 20 (пропускаем первые 20)
  const startIdx = (currentPage - 1) * perPage;

  try {
    // Загружаем ВСЕ акционные товары (без пагинации на сервере)
    const products = await fetchProductsByCategory("actions");

    // Вырезаем только нужные товары для текущей страницы
    const pagProducts = products.slice(startIdx, startIdx + perPage);

    return (
      <>
        {/* Рендерим секцию товаров только с элементами текущей страницы */}
        <ProductsSection
          title="Все акции"
          viewAllButton={{ text: "На главную", href: "/" }}
          products={pagProducts}
        />
        
        {/* Показываем пагинацию только если товаров больше чем на одну страницу */}
        {products.length > perPage && (
          <ClientPaginationWrapper
            totalItems={products.length} // Общее количество товаров
            currentPage={currentPage} // Текущая страница
            basePath="/actions" // Базовый путь для ссылок
            initialItemsPerPage={perPage} // Элементов на странице
          />
        )}
      </>
    );
  } catch {
    // Обработка ошибок при загрузке товаров
    return (
      <div className="text-red-500">Ошибка: не удалось загрузить акции</div>
    );
  }
};

export default AllActions;