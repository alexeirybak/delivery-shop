import { Order } from "@/types/order";
import TimeSlotGroup from "./TimeSlotGroup";

interface TimeSlotSectionProps {
  filteredOrders: Order[];
}

const TimeSlotSection = ({ filteredOrders }: TimeSlotSectionProps) => {
  const timeSlots = Array.from(
    new Set(filteredOrders.map((order) => order.deliveryTimeSlot))
  ).sort();
  return (
    <div className="flex flex-col gap-y-30">
      {timeSlots.map((timeSlot) => {
        const slotOrders = filteredOrders.filter(
          (order) => order.deliveryTimeSlot === timeSlot
        );
        return (
          <TimeSlotGroup
            key={timeSlot}
            timeSlot={timeSlot}
            slotOrders={slotOrders}
          />
        );
      })}
    </div>
  );
};

export default TimeSlotSection;