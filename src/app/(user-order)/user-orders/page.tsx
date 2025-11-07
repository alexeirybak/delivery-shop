"use client";

import { useEffect, useState } from "react";
import UserOrdersList from "./_components/UserOrderList";
import { Order } from "@/types/order";
import ErrorComponent from "@/components/ErrorComponent";
import { Loader } from "@/components/Loader";

const UserOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/orders");

        if (!response.ok) {
          throw new Error("Ошибка при загрузке заказов");
        }

        const data = await response.json();

        if (data.success) {
          setOrders(data.orders || []);
        } else {
          throw new Error(data.message || "Ошибка при загрузке заказов");
        }
      } catch (error) {
        setError({
          error:
            error instanceof Error ? error : new Error("Неизвестная ошибка"),
          userMessage: "Ошибка получения заказов. Попробуйте снова",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] mx-auto py-8">
      <h1 className="mb-6 md:mb-8 xl:mb-10 flex flex-row text-4xl md:text-5xl xl:text-[64px] text-main-text font-bold">
        Заказы
      </h1>

      <UserOrdersList orders={orders} />
    </div>
  );
};

export default UserOrderPage;
