export const isTimeSlotPassed = (timeSlot: string, date: string): boolean => {
  const now = new Date();
  
  const todayString = now.toISOString().split('T')[0];
  if (date !== todayString) {
    return false;
  }

  const [, endTime] = timeSlot.split("-");
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const slotEnd = new Date();
  slotEnd.setHours(endHours, endMinutes, 0, 0);
  const cutoff = new Date(slotEnd.getTime() - 30 * 60 * 1000);

  return now >= cutoff;
};