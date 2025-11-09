export const isTimeSlotPassed = (timeSlot: string, date: string): boolean => {
  const now = new Date();

  const [year, month, day] = date.split("-").map(Number);
  const selectedDateObj = new Date(year, month - 1, day);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (selectedDateObj.getTime() !== today.getTime()) {
    return false;
  }

  const [, endTime] = timeSlot.split("-");
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const slotEndTime = new Date();
  slotEndTime.setHours(endHours, endMinutes, 0, 0);

  return now > slotEndTime;
};
