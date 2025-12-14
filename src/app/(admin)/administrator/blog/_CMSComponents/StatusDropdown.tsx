"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { articleStatusOptions } from "../utils/filterOptions";

interface StatusDropdownProps {
  value: string;
  onChangeAction: (value: string) => void;
}

export default function StatusDropdown({
  value,
  onChangeAction,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = articleStatusOptions.find(
    (opt) => opt.value === value
  );

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600";
      case "draft":
        return "text-yellow-600";
      case "archived":
        return "text-blue-600";
      case "deleted":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm border border-gray-300 rounded px-3 py-1 cursor-pointer outline-none flex items-center justify-between min-w-[120px] bg-white hover:border-gray-400 transition-colors"
      >
        <span className={`font-medium ${getStatusColor(value)}`}>
          {selectedOption?.label}
        </span>
        <ChevronDown
          className={`w-3 h-3 ml-2 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
          {articleStatusOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChangeAction(option.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                value === option.value
                  ? "bg-primary/5 text-primary font-medium"
                  : "text-gray-700"
              } ${getStatusColor(option.value)}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
