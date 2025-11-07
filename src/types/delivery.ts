export interface DeliverySchedule {
  [date: string]: {
    [timeSlot: string]: boolean;
  };
}

export interface DeliveryTimes {
  schedule: DeliverySchedule;
  updatedAt: string;
}
