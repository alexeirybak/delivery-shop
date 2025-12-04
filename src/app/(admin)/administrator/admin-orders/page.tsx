"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import AdminOrdersHeader from "./_components/AdminOrdersHeader";
import { getThreeDaysDates } from "../delivery-times/utils/getThreeDaysDates";
import DateSelector from "./_components/DateSelector";
import TimeSlotSection from "./_components/TimeSlotSection";
import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";

const AdminOrderPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    data,
    isLoading,
    error: queryError,
  } = useGetAdminOrdersQuery(undefined, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const orders = useMemo(() => data?.orders || [], [data?.orders]);
  const stats = useMemo(() => data?.stats || null, [data?.stats]);

  useEffect(() => {
    if (orders.length > 0 && !selectedDate) {
      const threeDaysDates = getThreeDaysDates();
      const today = threeDaysDates[0];
      setSelectedDate(today);
    }
  }, [orders, selectedDate]);

  const filteredOrderIds = useMemo(() => {
    if (orders.length === 0) return [];
    const targetDate = selectedDate || getThreeDaysDates()[0];
    return orders
      .filter((order) => order.deliveryDate === targetDate)
      .map((order) => order._id);
  }, [orders, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setCustomDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      setSelectedDate(dateString);
    }
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const filterOrdersByDate = (date: string) => {
    setSelectedDate(date);
    setCustomDate(undefined);
    setIsCalendarOpen(false);
  };

  const threeDaysDates = getThreeDaysDates();

  if (isLoading) return <Loader />;

  if (queryError) {
    return (
      <ErrorComponent
        error={
          queryError instanceof Error
            ? queryError
            : new Error("Неизвестная ошибка")
        }
        userMessage="Не удалось получить заказы пользователя"
      />
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
      <TimeSlotSection orderIds={filteredOrderIds} />
    </div>
  );
};

export default AdminOrderPage;
