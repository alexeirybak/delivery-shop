import Image from "next/image";
import { Order } from "@/types/order";
import AdminOrderCard from "./AdminOrderCard";
import { useState, useEffect } from "react";
import CityFilterButtons from "./CityFilterButtons";
import { useOrderStore } from "@/store/orderStore";

interface TimeSlotGroupProps {
  timeSlot: string;
  slotOrders: Order[];
}

const TimeSlotGroup = ({ timeSlot, slotOrders }: TimeSlotGroupProps) => {
  const [selectedCity, setSelectedCity] = useState<string>("Все города");
  
  const { 
    initializeSlot, 
    getCompletedCount, 
    updateCompletedCount 
  } = useOrderStore();

  // Получаем уникальные города из заказов текущего временного слота
  const getUniqueCities = () => {
    const citiesSet = new Set<string>();
    slotOrders.forEach((order) => {
      if (order.deliveryAddress?.city) {
        citiesSet.add(order.deliveryAddress.city);
      }
    });
    return [
      "Все города",
      ...Array.from(citiesSet).filter((city) => city && city !== ""),
    ];
  };

  const cities = getUniqueCities();

  // Фильтруем заказы по выбранному городу
  const filteredSlotOrders =
    selectedCity === "Все города"
      ? slotOrders
      : slotOrders.filter(
          (order) => order.deliveryAddress?.city === selectedCity
        );

  const startTime = timeSlot.split("-")[0];

  // Инициализируем счетчики для всех городов при монтировании
  useEffect(() => {
    // Для "Все города"
    const allCitiesCompleted = slotOrders.filter(
      (order) => order.status === "confirmed"
    ).length;
    initializeSlot(timeSlot, "Все города", slotOrders.length, allCitiesCompleted);

    // Для каждого отдельного города
    cities.forEach(city => {
      if (city !== "Все города") {
        const cityOrders = slotOrders.filter(
          (order) => order.deliveryAddress?.city === city
        );
        const cityCompleted = cityOrders.filter(
          (order) => order.status === "confirmed"
        ).length;
        initializeSlot(timeSlot, city, cityOrders.length, cityCompleted);
      }
    });
  }, [timeSlot, slotOrders, cities, initializeSlot]);

  // Получаем актуальное количество подтвержденных заказов для выбранного города
  const completedOrdersCount = getCompletedCount(timeSlot, selectedCity);

  // Общее количество заказов для выбранного города
  const totalOrdersCount = selectedCity === "Все города" 
    ? slotOrders.length 
    : slotOrders.filter(order => order.deliveryAddress?.city === selectedCity).length;

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  // Функция для обновления статуса заказа
  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    const order = slotOrders.find(o => o._id === orderId);
    if (!order) return;

    const wasConfirmed = order.status === "confirmed";
    const isNowConfirmed = newStatus === "confirmed";
    const orderCity = order.deliveryAddress?.city || "Неизвестный город";
    
    // Обновляем счетчик для "Все города" (всегда)
    if (wasConfirmed && !isNowConfirmed) {
      updateCompletedCount(timeSlot, "Все города", -1);
    } else if (!wasConfirmed && isNowConfirmed) {
      updateCompletedCount(timeSlot, "Все города", 1);
    }
    
    // Обновляем счетчик для конкретного города заказа
    if (wasConfirmed && !isNowConfirmed) {
      updateCompletedCount(timeSlot, orderCity, -1);
    } else if (!wasConfirmed && isNowConfirmed) {
      updateCompletedCount(timeSlot, orderCity, 1);
    }
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
            <span className="text-2xl">{totalOrdersCount}</span>
          </div>
        </div>
      </div>

      {cities.length > 1 && (
        <CityFilterButtons
          cities={cities}
          slotOrders={slotOrders}
          selectedCity={selectedCity}
          onCitySelect={handleCitySelect}
        />
      )}

      <div className="flex flex-col gap-y-15">
        {filteredSlotOrders.map((order) => (
          <AdminOrderCard 
            key={order._id} 
            order={order} 
            onStatusUpdate={handleOrderStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGroup;