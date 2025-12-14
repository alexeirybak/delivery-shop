
import { useGetAdminOrdersQuery } from "@/store/api/ordersApi";
import TimeSlotGroup from "./TimeSlotGroup";

interface TimeSlotSectionProps {
  orderIds: string[]; // Принимаем только IDs
}

// Самый простой вариант - если заказов немного (до 50)
const TimeSlotSection = ({ orderIds }: TimeSlotSectionProps) => {
  const { data } = useGetAdminOrdersQuery();
  
  const orders = data?.orders?.filter(order => orderIds.includes(order._id)) || [];
  
  const timeSlots = [...new Set(orders.map(o => o.deliveryTimeSlot))].sort();
  
  const timeSlotGroups = timeSlots.map(timeSlot => ({
    timeSlot,
    orderIds: orders
      .filter(order => order.deliveryTimeSlot === timeSlot)
      .map(order => order._id)
  }));

  return (
    <div className="space-y-8">
      {timeSlotGroups.map(({ timeSlot, orderIds }) => (
        <TimeSlotGroup key={timeSlot} timeSlot={timeSlot} orderIds={orderIds} />
      ))}
    </div>
  );
};

export default TimeSlotSection;
