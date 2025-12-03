import { isTimeSlotPassed } from "@/app/(cart)/cart/utils/isTimeSlotPassed";
import { Schedule } from "@/types/deliverySchedule";
import { formatDateToLocalYYYYMMDD } from "../../../../(admin)/administrator/admin-orders/utils/formatDateToLocalYYYYMMDD";

export const getAvailableTimeSlots = (
  date: Date,
  schedule: Schedule
): string[] => {
  const dateString = formatDateToLocalYYYYMMDD(date);
  const daySchedule = schedule[dateString as keyof typeof schedule];

  if (!daySchedule) {
    return [];
  }

  const availableSlots = Object.entries(daySchedule)
    .filter(([timeSlot, available]) => {
      if (!available) {
        console.log(`Slot ${timeSlot} not available in schedule`);
        return false;
      }
      const isPassed = isTimeSlotPassed(timeSlot, dateString);
      return !isPassed;
    })
    .map(([timeSlot]) => timeSlot)
    .sort();

  return availableSlots;
};
