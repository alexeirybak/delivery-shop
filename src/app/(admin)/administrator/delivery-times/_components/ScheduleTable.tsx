import ScheduleTableHeader from "./ScheduleTableHeader";
import ScheduleTableRow from "./ScheduleTableRow";

interface ScheduleTableProps {
  sortedTimeSlots: string[];
  dates: string[];
  schedule: { [date: string]: { [timeSlot: string]: boolean } };
  onRemoveTimeSlot: (slot: string) => void;
  onUpdateTimeSlotStatus: (date: string, timeSlot: string, free: boolean) => void;
}

export default function ScheduleTable({
  sortedTimeSlots,
  dates,
  schedule,
  onRemoveTimeSlot,
  onUpdateTimeSlotStatus,
}: ScheduleTableProps) {
  if (sortedTimeSlots.length === 0) {
    return (
      <div className="p-6 md:p-8 text-center text-gray-500 text-sm md:text-base">
        Нет добавленных временных слотов. Добавьте первый слот выше.
      </div>
    );
  }

  return (
    <div className="w-full">
      <ScheduleTableHeader dates={dates} />
      
      <div className="divide-y divide-[#151515]">
        {sortedTimeSlots.map((timeSlot) => (
          <ScheduleTableRow
            key={timeSlot}
            timeSlot={timeSlot}
            dates={dates}
            schedule={schedule}
            onRemoveTimeSlot={onRemoveTimeSlot}
            onUpdateTimeSlotStatus={onUpdateTimeSlotStatus}
          />
        ))}
      </div>
    </div>
  );
}