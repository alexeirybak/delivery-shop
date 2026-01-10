import Image from "next/image";
import { Order } from "@/types/order";
import AdminOrderCard from "./AdminOrderCard";
import { useState, useEffect } from "react";
import CityFilterButtons from "./CityFilterButtons";
import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";
import { getUniqueCities } from "../utils/getUniqueCities";

interface TimeSlotGroupProps {
  timeSlot: string;
  orderIds: string[];
}

const TimeSlotGroup = ({ timeSlot, orderIds }: TimeSlotGroupProps) => {
  const { data } = useGetAdminOrdersQuery();
  const [selectedCity, setSelectedCity] = useState<string>("Все города");
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (data?.orders) {
      const filteredOrders = data.orders.filter((order) =>
        orderIds.includes(order._id)
      );
      setLocalOrders(filteredOrders);
    }
  }, [data?.orders, orderIds]);

  const cities = getUniqueCities(localOrders);

  const filteredSlotOrders =
    selectedCity === "Все города"
      ? localOrders
      : localOrders.filter(
          (order) => order.deliveryAddress?.city === selectedCity
        );

  const startTime = timeSlot.split("-")[0];

  const completedOrdersCount = filteredSlotOrders.filter(
    (order) => order.status === "confirmed"
  ).length;

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <div key={timeSlot}>
      <div className="flex justify-between text-xl md:text-2xl xl:text-4xl text-main-text">
        <div className="flex gap-x-4 mb-4">
          <Image
            alt={timeSlot}
            src="/icons-orders/icon-clock.svg"
            width={24}
            height={24}
            className="w-6 h-6"
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
            <span className="text-2xl">{filteredSlotOrders.length}</span>
          </div>
        </div>
      </div>

      {cities.length > 1 && (
        <CityFilterButtons
          cities={cities}
          slotOrders={localOrders}
          selectedCity={selectedCity}
          onCitySelect={handleCitySelect}
        />
      )}

      <div className="flex flex-col gap-y-15">
        {filteredSlotOrders.map((order) => (
          <AdminOrderCard
            key={order._id}
            orderId={order._id} // Передаем только ID, как требует дочерний компонент
          />
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGroup;
