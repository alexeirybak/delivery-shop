import { useState, useCallback } from "react";
import { getThreeDaysDates } from "@/app/(admin)/administrator/delivery-times/utils/getThreeDaysDates";
import { convertTimeToMinutes } from "@/app/(admin)/administrator/delivery-times/utils/convertTimeToMinutes";
import { Schedule } from "@/types/deliverySchedule";

export function useDeliverySchedule() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("14:00");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const dates = getThreeDaysDates();

  const showMessage = useCallback(
    (text: string) => {
      setMessage(text);
    },
    []
  );

  const initializeEmptySchedule = useCallback(() => {
    const emptySchedule: Schedule = {};

    dates.forEach((date) => {
      emptySchedule[date] = {};
    });

    setSchedule(emptySchedule);
  }, [dates]);

  const fetchDeliveryTimes = useCallback(async () => {
    try {
      const response = await fetch("/api/delivery-times");
      const data = await response.json();

      if (data.schedule && Object.keys(data.schedule).length > 0) {
        const loadedSchedule = data.schedule as Schedule;

        // const updatedSchedule = dates.reduce<Schedule>((acc, date) => {
        //   acc[date] = loadedSchedule[date] ? { ...loadedSchedule[date] } : {};
        //   return acc;
        // }, {});

        const updatedSchedule: Schedule = {};

        dates.forEach((date) => {
          updatedSchedule[date] = loadedSchedule[date]
            ? { ...loadedSchedule[date] }
            : {};
        });

        setSchedule(updatedSchedule);

        const slots = new Set(
          dates.flatMap((date) => Object.keys(updatedSchedule[date] || {}))
        );

        setTimeSlots(Array.from(slots));
      } else {
        initializeEmptySchedule();
      }
    } catch {
      setError("Ошибка загрузки графика доставки");
      initializeEmptySchedule();
    } finally {
      setLoading(false);
    }
  }, [dates, initializeEmptySchedule]);

  const addTimeSlot = useCallback(() => {
    setError("");

    if (!startTime.trim() || !endTime.trim()) {
      setError("Заполните оба поля времени");
      return;
    }

    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      setError("Время начала должно быть раньше времени окончания");
      return;
    }

    const timeSlotValue = `${startTime}-${endTime}`;

    const hasOverlap = timeSlots.some((existingSlot) => {
      const [existingStart, existingEnd] = existingSlot.split("-");
      const existingStartMinutes = convertTimeToMinutes(existingStart);
      const existingEndMinutes = convertTimeToMinutes(existingEnd);

      return (
        (startMinutes >= existingStartMinutes &&
          startMinutes < existingEndMinutes) ||
        (endMinutes > existingStartMinutes &&
          endMinutes <= existingEndMinutes) ||
        (startMinutes <= existingStartMinutes &&
          endMinutes >= existingEndMinutes)
      );
    });

    if (hasOverlap) {
      setError("Временной слот пересекается с существующими слотами");
      return;
    }

    const updatedTimeSlots = [...timeSlots, timeSlotValue];
    setTimeSlots(updatedTimeSlots);

    const updatedSchedule: Schedule = { ...schedule };

    dates.forEach((date) => {
      if (!updatedSchedule[date]) updatedSchedule[date] = {};
      updatedSchedule[date][timeSlotValue] = true;
    });

    setSchedule(updatedSchedule);
    showMessage("Временной слот добавлен для всех дней");
  }, [startTime, endTime, timeSlots, schedule, dates, showMessage]);

  const updateTimeSlotStatus = useCallback(
    (date: string, timeSlot: string, free: boolean) => {
      setSchedule((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          [timeSlot]: free,
        },
      }));
    },
    []
  );

  const removeTimeSlot = useCallback(
    (slotToRemove: string) => {
      setError("");

      const updatedTimeSlots = timeSlots.filter(
        (slot) => slot !== slotToRemove
      );
      setTimeSlots(updatedTimeSlots);

      const updatedSchedule: Schedule = { ...schedule };

      dates.forEach((date) => {
        if (updatedSchedule[date]) {
          delete updatedSchedule[date][slotToRemove];
        }
      });

      setSchedule(updatedSchedule);
      showMessage("Временной слот удален из всех дней");
    },
    [timeSlots, schedule, dates, showMessage]
  );

  const saveDeliveryTimes = useCallback(async () => {
    setError("");
    setSaving(true);
    setMessage("");

    try {
      const scheduleToSend: Schedule = {};

      dates.forEach((date) => {
        scheduleToSend[date] = {};
        timeSlots.forEach((slot) => {
          scheduleToSend[date][slot] = schedule[date]?.[slot] !== false;
        });
      });

      const response = await fetch("/api/delivery-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule: scheduleToSend }),
      });

      const result = await response.json();

      if (result.success) {
        showMessage("График доставки успешно сохранен!");
      } else {
        setError(result.error || "Ошибка при сохранении");
      }
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      setError("Ошибка при сохранении графика доставки");
    } finally {
      setSaving(false);
    }
  }, [dates, timeSlots, schedule, showMessage]);

  return {
    schedule,
    loading,
    saving,
    message,
    error,
    startTime,
    endTime,
    timeSlots,
    setStartTime,
    setEndTime,
    fetchDeliveryTimes,
    showMessage,
    addTimeSlot,
    updateTimeSlotStatus,
    removeTimeSlot,
    saveDeliveryTimes,
  };
}
