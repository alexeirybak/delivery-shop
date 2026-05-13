"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { statuses } from "../../utils/statuses";

interface CustomStatusSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function CustomStatusSelect({
  value,
  onChange,
}: CustomStatusSelectProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = statuses.find((s) => s.value === value);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
  };

  return (
    <div className="custom-status-select" ref={ref}>
      <div
        className={`custom-status-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selected ? "" : "placeholder"}>
          {selected ? selected.label : "Выберите Ваш статус"}
        </span>
        <ChevronDown className={`chevron ${isOpen ? "rotated" : ""}`} />
      </div>

      {isOpen && (
        <div className="custom-status-dropdown">
          {statuses.map((status) => (
            <div
              key={status.value}
              className={`custom-status-option ${
                value === status.value ? "selected" : ""
              }`}
              onClick={() => handleSelect(status.value)}
            >
              {status.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
