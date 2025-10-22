"use client";

import fetchPurchases from "./fetchPurchases";
import ProductsSection from "../../components/ProductsSection";
import { CONFIG } from "../../../config/config";
import ErrorComponent from "@/components/ErrorComponent";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { ProductCardProps } from "@/types/product";
import { Loader } from "lucide-react";

const Purchases = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<ProductCardProps[]>([]);
  const { user, isAuth } = useAuthStore();
  const userId = user?.id;

  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      try {
        const hasAccess = isAuth && user?.role === "user";
        setShouldShow(hasAccess);

        if (hasAccess) {
          const { items: purchases } = await fetchPurchases({
            userPurchasesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
            userId,
          });
          setItems(purchases);
        }
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndFetchData();
  }, [isAuth, user, userId]);

  if (!shouldShow) return null;

  if (loading) return <Loader />;

  if (error) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error : new Error(String(error))}
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
