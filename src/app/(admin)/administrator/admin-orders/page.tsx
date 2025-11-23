"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import AdminOrdersHeader from "./_components/AdminOrdersHeader";
import { getThreeDaysDates } from "../delivery-times/utils/getThreeDaysDates";
import DateSelector from "./_components/DateSelector";
import TimeSlotSection from "./_components/TimeSlotSection";

interface OrderStats {
  nextThreeDaysOrders: number;
}

const AdminOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/users/orders");
      if (!response.ok) {
        throw new Error("Ошибка при загрузке заказов");
      }
      const data = await response.json();
      setOrders(data.orders);
      setStats(data.stats);

      const threeDaysDates = getThreeDaysDates();
      const today = threeDaysDates[0];
      setSelectedDate(today);

      const todayOrders = data.orders.filter(
        (order: Order) => order.deliveryDate === today
      );
      setFilteredOrders(todayOrders);
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось получить заказы пользователя",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setCustomDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      setSelectedDate(dateString);
      const filtered = orders.filter(
        (order) => order.deliveryDate === dateString
      );
      setFilteredOrders(filtered);
      setIsCalendarOpen(false);
    }
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const filterOrdersByDate = (date: string) => {
    setSelectedDate(date);
    setCustomDate(undefined);
    setIsCalendarOpen(false);
    const filtered = orders.filter((order) => order.deliveryDate === date);
    setFilteredOrders(filtered);
  };

  const threeDaysDates = getThreeDaysDates();

  if (loading) return <Loader />;

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] mx-auto mb-8 py-8">
      <AdminOrdersHeader stats={stats} />
      <DateSelector
        orders={orders}
        dates={threeDaysDates}
        selectedDate={selectedDate}
        customDate={customDate}
        isCalendarOpen={isCalendarOpen}
        toggleCalendar={toggleCalendar}
        onCalendarDateSelect={handleDateSelect}
        onDateSelect={filterOrdersByDate}
      />
      <TimeSlotSection filteredOrders={filteredOrders} />
    </div>
  );
};

export default AdminOrderPage;
