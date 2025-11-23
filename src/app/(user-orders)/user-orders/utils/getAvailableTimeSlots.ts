import { isTimeSlotPassed } from "@/app/(cart)/cart/utils/isTimeSlotPassed";
import { Schedule } from "@/types/deliverySchedule";

export const getAvailableTimeSlots = (date: Date, schedule: Schedule): string[] => {
  const dateString = date.toISOString().split("T")[0];
  const daySchedule = schedule[dateString as keyof typeof schedule];

  if (!daySchedule) {
    return [];
  }

  const availableSlots = Object.entries(daySchedule)
    .filter(([timeSlot, available]) => {
      if (!available) return false;
      const isPassed = isTimeSlotPassed(timeSlot, dateString);
      return !isPassed;
    })
    .map(([timeSlot]) => timeSlot)
    .sort();

  return availableSlots;
};