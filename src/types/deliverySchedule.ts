interface DaySchedule {
  [timeSlot: string]: boolean;
}

export interface Schedule {
  [date: string]: DaySchedule;
}
