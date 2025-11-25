import Image from "next/image";
import AdminOrderCard from "./AdminOrderCard";
import { useGetAdminOrdersQuery } from "@/store/api/ordersApi";
import { useMemo } from "react";

interface TimeSlotGroupProps {
  timeSlot: string;
  orderIds: string[]; // Принимаем только IDs
}

const TimeSlotGroup = ({ timeSlot, orderIds }: TimeSlotGroupProps) => {
  const { data } = useGetAdminOrdersQuery();

  // Находим заказы по IDs
  const orders = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.filter((order) => orderIds.includes(order._id));
  }, [data?.orders, orderIds]);

  const completedOrdersCount = useMemo(
    () => orders.filter((order) => order.status === "confirmed").length,
    [orders]
  );

  const startTime = timeSlot.split("-")[0];

  return (
    <div>
      <div className="flex justify-between text-xl md:text-2xl xl:text-4xl text-main-text">
        <div className="flex gap-x-4 mb-4">
          <Image
            alt={timeSlot}
            src="/icons-orders/icon-clock.svg"
            width={24}
            height={24}
          />
          <span className="font-bold">{startTime}</span>
        </div>
        <div className="flex gap-x-2.5 items-center">
          <Image
            alt={timeSlot}
            src="/icons-orders/icon-check.svg"
            width={24}
            height={24}
          />
          <div>
            <span className="text-2xl">{completedOrdersCount}</span>
            <span className="text-xl">{" / "}</span>
            <span className="text-2xl">{orders.length}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-15">
        {orderIds.map((orderId) => (
          <AdminOrderCard
            key={orderId}
            orderId={orderId} // Передаем только ID
          />
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGroup;
