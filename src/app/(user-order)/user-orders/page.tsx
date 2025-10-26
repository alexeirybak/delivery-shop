"use client";

import { useEffect, useState } from "react";
import UserOrdersList from "./_components/UserOrderList";
import { Order } from "@/types/order";
import { Loader } from "@/components/Loader";

const UserOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) <Loader />;

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] mx-auto py-8">
      <h1 className="mb-6 md:mb-8 xl:mb-10 flex flex-row text-4xl md:text-5xl xl:text-[64px] text-main-text font-bold">
        Заказы
      </h1>
      {error && (
        <div className="text-center py-6 text-[#d80000]">Ошибка: {error}</div>
      )}

      <UserOrdersList orders={orders} />
    </div>
  );
};

export default UserOrderPage;
