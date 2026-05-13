"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { statuses } from "@/app/auth/utils/statuses";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CustomSelect = ({ value, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = statuses.find(s => s.value === value) || statuses[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={ref}>
      <div className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected.label}</span>
        <ChevronDown className={`chevron ${isOpen ? "rotated" : ""}`} />
      </div>
      
      {isOpen && (
        <div className="custom-select-dropdown">
          {statuses.map((status) => (
            <div
              key={status.value}
              className={`custom-select-option ${value === status.value ? "selected" : ""}`}
              onClick={() => {
                onChange(status.value);
                setIsOpen(false);
              }}
            >
              {status.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};