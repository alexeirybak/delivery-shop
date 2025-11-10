import { useState, useEffect } from "react";
import { Schedule } from "@/types/deliverySchedule";

interface DeliveryTimes {
  schedule: Schedule;
  updatedAt: string;
}

export const useDeliveryData = () => {
  const [deliverySchedule, setDeliverySchedule] = useState<Schedule>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliverySchedule = async () => {
      try {
        const response = await fetch("/api/delivery-times");
        if (response.ok) {
          const data: DeliveryTimes = await response.json();
          setDeliverySchedule(data.schedule || {});
        }
      } catch (error) {
        console.error("Ошибка загрузки расписания доставки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverySchedule();
  }, []);

  return { deliverySchedule, loading };
};