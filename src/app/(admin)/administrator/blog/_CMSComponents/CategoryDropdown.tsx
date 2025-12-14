"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface CategoryDropdownProps {
  value: string;
  onChangeAction: (value: string) => void;
  categories: string[];
  compact?: boolean;
}

export default function CategoryDropdown({
  value,
  onChangeAction,
  categories,
  compact = false,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    ? "text-xs border border-gray-300 rounded px-2 py-1 cursor-pointer outline-none flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
    : "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer outline-none flex justify-between items-center bg-white hover:border-gray-400 transition-colors";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <span className="text-gray-700 font-medium">{value}</span>
        <ChevronDown
          className={`w-3 h-3 ml-1 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => {
                onChangeAction(category);
                setIsOpen(false);
              }}
              className={`px-2 py-1 hover:bg-gray-100 cursor-pointer transition-colors ${
                value === category
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-700"
              }`}
            >
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}