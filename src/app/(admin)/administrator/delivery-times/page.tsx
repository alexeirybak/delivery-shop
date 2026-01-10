"use client";

import { Loader } from "@/components/Loader";
import { useEffect } from "react";
import AddTimeSlotForm from "./_components/AddTimeSlotForm";
import MessageAlert from "./_components/MessageAlert";
import { useDeliverySchedule } from "@/hooks/useDeliverySchedule";
import { getThreeDaysDates } from "./utils/getThreeDaysDates";
import { sortTimeSlots } from "./utils/sortTimeSlots";
import ScheduleTable from "./_components/ScheduleTable";
import SaveButton from "./_components/SaveButton";

export default function DeliveryTimesAdmin() {
  const {
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
    addTimeSlot,
    updateTimeSlotStatus,
    removeTimeSlot,
    saveDeliveryTimes,
  } = useDeliverySchedule();

  const dates = getThreeDaysDates();
  const sortedTimeSlots = sortTimeSlots(timeSlots);

  useEffect(() => {
    fetchDeliveryTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-3 md:p-4 xl:p-6 w-full mx-auto md:w-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
        Управление графиком доставки на 3 дня
      </h1>

      <AddTimeSlotForm
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onAddTimeSlot={addTimeSlot}
      />

      <div className="bg-white rounded border border-gray-200 mb-4 md:mb-6 overflow-x-auto">
        <ScheduleTable
          sortedTimeSlots={sortedTimeSlots}
          dates={dates}
          schedule={schedule}
          onRemoveTimeSlot={removeTimeSlot}
          onUpdateTimeSlotStatus={updateTimeSlotStatus}
        />
      </div>

      <SaveButton saving={saving} onClick={saveDeliveryTimes} />
      {message && <MessageAlert message={message} />}
      {error && (
        <div className="p-3 md:p-4 mb-4 rounded border bg-[#ffc7c7] text-[#d80000]">
          {error}
        </div>
      )}
    </div>
  );
}
