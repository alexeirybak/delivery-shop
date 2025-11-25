// components/TimeSlotSection.tsx
import { useGetAdminOrdersQuery } from "@/store/api/ordersApi";
import TimeSlotGroup from "./TimeSlotGroup";
import { useMemo } from "react";

interface TimeSlotSectionProps {
  orderIds: string[]; // Принимаем только IDs
}

const TimeSlotSection = ({ orderIds }: TimeSlotSectionProps) => {
  const { data } = useGetAdminOrdersQuery();

  // Находим заказы по IDs
  const orders = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.filter(order => orderIds.includes(order._id));
  }, [data?.orders, orderIds]);

  // Группируем по временным слотам
  const timeSlotGroups = useMemo(() => {
    const timeSlots = Array.from(
      new Set(orders.map((order) => order.deliveryTimeSlot))
    ).sort();

    return timeSlots.map(timeSlot => ({
      timeSlot,
      orderIds: orders
        .filter(order => order.deliveryTimeSlot === timeSlot)
        .map(order => order._id)
    }));
  }, [orders]);

  return (
    <div className="space-y-8">
      {timeSlotGroups.map(({ timeSlot, orderIds }) => (
        <TimeSlotGroup
          key={timeSlot}
          timeSlot={timeSlot}
          orderIds={orderIds}
        />
      ))}
    </div>
  );
};

export default TimeSlotSection;