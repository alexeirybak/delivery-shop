import { DeliveryData } from "./cart";

interface DaySchedule {
  [timeSlot: string]: boolean;
}

export interface Schedule {
  [date: string]: DaySchedule;
}

export interface DeliveryInfoProps {
  delivery: DeliveryData;
  onEdit: () => void;
}
