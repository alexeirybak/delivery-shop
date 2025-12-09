"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  value: string;
  onChangeAction: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export default function Dropdown({
  value,
  onChangeAction,
  options,
  placeholder,
  className = "",
  compact = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value) || {
    value: "",
    label: placeholder || "Выберите...",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonClasses = compact
    ? "text-sm border border-gray-300 rounded px-3 py-1 cursor-pointer outline-none flex items-center justify-between min-w-[120px] bg-white hover:border-gray-400 transition-colors"
    : "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer outline-none flex justify-between items-center bg-white hover:border-gray-400 transition-colors";

  const labelClasses = compact ? "text-sm font-medium" : "text-gray-700";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <span className={labelClasses}>{selectedOption.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChangeAction(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                value === option.value
                  ? "bg-primary/5 text-primary font-medium"
                  : "text-gray-700"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
