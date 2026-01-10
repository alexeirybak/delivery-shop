import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";
import TimeSlotGroup from "./TimeSlotGroup";

interface TimeSlotSectionProps {
  orderIds: string[];
}

const TimeSlotSection = ({ orderIds }: TimeSlotSectionProps) => {
  const { data } = useGetAdminOrdersQuery();

  const orders =
    data?.orders?.filter((order) => orderIds.includes(order._id)) || [];

  const timeSlots = [...new Set(orders.map((o) => o.deliveryTimeSlot))].sort();

  const timeSlotGroups = timeSlots.map((timeSlot) => ({
    timeSlot,
    orderIds: orders
      .filter((order) => order.deliveryTimeSlot === timeSlot)
      .map((order) => order._id),
  }));

  return (
    <div className="flex flex-col gap-y-30">
      {timeSlotGroups.map(({ timeSlot, orderIds }) => (
        <TimeSlotGroup key={timeSlot} timeSlot={timeSlot} orderIds={orderIds} />
      ))}
    </div>
  );
};

export default TimeSlotSection;
