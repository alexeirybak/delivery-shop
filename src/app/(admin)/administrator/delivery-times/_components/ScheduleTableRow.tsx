import { buttonStyles } from "@/app/styles";
import SelectedIcon from "@/app/(cart)/cart/_components/SelectedIcon";

interface ScheduleTableRowProps {
  timeSlot: string;
  dates: string[];
  schedule: { [date: string]: { [timeSlot: string]: boolean } };
  onRemoveTimeSlot: (slot: string) => void;
  onUpdateTimeSlotStatus: (
    date: string,
    timeSlot: string,
    free: boolean
  ) => void;
}

export default function ScheduleTableRow({
  timeSlot,
  dates,
  schedule,
  onRemoveTimeSlot,
  onUpdateTimeSlotStatus,
}: ScheduleTableRowProps) {
  return (
    <div className="grid grid-cols-4 hover:bg-gray-50 transition-colors">
      <div className="p-2 md:p-3 border-r border-gray-200 flex flex-col justify-between">
        <div className="font-medium text-sm md:text-base mb-1 md:mb-2">
          {timeSlot}
        </div>
        <button
          onClick={() => onRemoveTimeSlot(timeSlot)}
          className={`${buttonStyles.active} text-[10px] md:text-sm p-1`}
        >
          Удалить слот
        </button>
      </div>

      {dates.map((date, index) => (
        <div
          key={date}
          className={`p-2 md:p-3 flex items-center justify-center border-r border-gray-200 ${
            index === dates.length - 1 ? "border-r-0" : ""
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={schedule[date]?.[timeSlot] !== false}
                onChange={(e) =>
                  onUpdateTimeSlotStatus(date, timeSlot, e.target.checked)
                }
                className="hidden"
              />
              <span
                className={`
                  w-6 h-6 border-2 rounded flex items-center justify-center duration-300
                  ${
                    schedule[date]?.[timeSlot] !== false
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-300"
                  }
                `}
              >
                {schedule[date]?.[timeSlot] !== false && <SelectedIcon />}
              </span>
            </label>
            <span
              className={`text-xs md:text-sm ${
                schedule[date]?.[timeSlot] !== false
                  ? "text-primary"
                  : "text-[#d80000]"
              }`}
            >
              {schedule[date]?.[timeSlot] !== false ? "Свободно" : "Занято"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
