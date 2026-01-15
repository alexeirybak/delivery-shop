"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { EditorProps } from "../../../types";

const FONT_SIZES = [
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "Сбросить", value: "unset" },
];

export const FontSizeMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!editor) return null;

  const currentSize = editor.getAttributes("textStyle").fontSize || "14px";

  const handleSizeChange = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsOpen(false);
    if (size === "unset") {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(size).run();
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div
      className="tiptap-fontsize-dropdown"
      onClick={(e) => e.stopPropagation()} 
    >
      <button
        onClick={handleTriggerClick}
        className="font-size-trigger"
        aria-label="Размер шрифта"
        aria-expanded={isOpen}
        title="Размер шрифта"
      >
        <span className="text-xs font-mono">
          {currentSize === "unset" ? "Размер" : currentSize.replace("px", "")}
        </span>
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="tiptap-fontsize-dropdown-overlay"
            onClick={handleOverlayClick}
          />

          <div
            className="tiptap-fontsize-dropdown-content"
          >
            <div className="tiptap-fontsize-header">Размер шрифта</div>

            {FONT_SIZES.map((size) => {
              const isActive =
                size.value === "unset"
                  ? !editor.getAttributes("textStyle").fontSize
                  : currentSize === size.value;

              return (
                <button
                  key={size.value}
                  onClick={(e) => handleSizeChange(size.value, e)}
                  className={`tiptap-fontsize-option ${isActive ? "active" : ""}`}
                  style={
                    size.value !== "unset"
                      ? { fontSize: size.value }
                      : undefined
                  }
                >
                  <span>{size.label}</span>
                  {isActive && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
