"use client";

import { useState, useEffect } from "react";
import fetchPurchases from "./fetchPurchases";
import ProductsSection from "../../components/ProductsSection";
import { CONFIG } from "../../../config/config";
import ErrorComponent from "@/components/ErrorComponent";
import { Loader } from "@/components/Loader";
import { ProductCardProps } from "@/types/product";
import { useAuthStore } from "@/store/authStore";

const Purchases = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [items, setItems] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAuth } = useAuthStore();

  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      try {
        // Проверяем роль пользователя из store
        const hasAccess = isAuth && user?.role === "user";
        setShouldShow(hasAccess);

        if (hasAccess) {
          // Если доступ есть, загружаем данные о покупках
          const { items: purchases } = await fetchPurchases({
            userPurchasesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
          });
          setItems(purchases);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndFetchData();
  }, [isAuth, user]); // Добавляем зависимости

  // Не показываем ничего если нет доступа
  if (!shouldShow) {
    return null;
  }

  if (loading) {
    return <Loader text="ваших покупок" />;
  }

  if (error) {
    return (
      <ErrorComponent
        error={error}
        userMessage="Не удалось загрузить Ваши покупки"
      />
    );
  }

  return (
    <ProductsSection
      title="Покупали раньше"
      viewAllButton={{ text: "Все покупки", href: "purchases" }}
      products={items}
    />
  );
};

export default Purchases;