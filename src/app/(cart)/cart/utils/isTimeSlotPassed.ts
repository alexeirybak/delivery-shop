export const isTimeSlotPassed = (timeSlot: string, date: string): boolean => {
  const now = new Date();

  // Создаем объект даты из selectedDate (формат YYYY-MM-DD)
  const [year, month, day] = date.split("-").map(Number);
  const selectedDateObj = new Date(year, month - 1, day);

  // Получаем сегодняшнюю дату без времени
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Если выбран не сегодняшний день, слот не прошел
  if (selectedDateObj.getTime() !== today.getTime()) {
    return false;
  }

  // Получаем время окончания слота
  const [, endTime] = timeSlot.split("-");
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Создаем объект времени окончания слота на сегодня
  const slotEndTime = new Date();
  slotEndTime.setHours(endHours, endMinutes, 0, 0);

  // Сравниваем с текущим временем
  return now > slotEndTime;
};
