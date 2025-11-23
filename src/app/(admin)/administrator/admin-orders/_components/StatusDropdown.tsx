import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { CUSTOMER_STATUSES } from "../utils/customerStatuses";
import { getStatusColorClass } from "../utils/getStatusColorClass";

interface StatusDropdownProps {
  currentStatusLabel: string;
  isUpdating: boolean;
  onStatusChange: (newStatusLabel: string) => void;
}

const StatusDropdown = ({
  currentStatusLabel,
  isUpdating,
  onStatusChange,
}: StatusDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentStatusData = CUSTOMER_STATUSES.find(
    (status) => status.label === currentStatusLabel
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isUpdating && setIsDropdownOpen(!isDropdownOpen)}
        disabled={isUpdating}
        className={`w-50 h-10 flex items-center justify-between p-2 rounded text-base border-none outline-none duration-300 cursor-pointer ${getStatusColorClass(
          currentStatusLabel,
          true
        )} ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2 flex-1">
          {currentStatusData && (
            <Image
              src={currentStatusData.icon}
              alt={currentStatusData.label}
              width={24}
              height={24}
              className={`flex-shrink-0 ${
                currentStatusLabel === "Доставляется" ||
                currentStatusLabel === "Новый"
                  ? ""
                  : "filter brightness-0 invert"
              }`}
            />
          )}
          <span
            className={`flex-1 text-left ${
              currentStatusLabel === "Доставляется" ||
              currentStatusLabel === "Новый"
                ? "text-[#606060]"
                : "text-[#f3f2f1]"
            }`}
          >
            {currentStatusLabel}
          </span>
        </div>
        <Image
          src="/icons-header/icon-arrow.svg"
          alt="Раскрыть"
          width={24}
          height={24}
          className={`transition-transform ${
            currentStatusLabel === "Доставляется" ||
            currentStatusLabel === "Новый"
              ? ""
              : "filter brightness-0 invert"
          } ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-200 w-50">
          {CUSTOMER_STATUSES.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => {
                onStatusChange(status.label);
                setIsDropdownOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-[#fcd5ba] duration-300 cursor-pointer ${getStatusColorClass(
                status.label,
                false
              )}`}
            >
              <Image
                src={status.icon}
                alt={status.label}
                width={24}
                height={24}
                className="flex-shrink-0 filter brightness-0"
              />
              <span>{status.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
