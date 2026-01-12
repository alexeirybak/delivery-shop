"use client";

import { Editor } from "@tiptap/react";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

interface FontSizeMenuProps {
  editor: Editor | null;
}

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

export const FontSizeMenu = ({ editor }: FontSizeMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!editor) return null;

  const currentSize = editor.getAttributes('textStyle').fontSize || '14px';

  const handleSizeChange = (size: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие
    e.preventDefault(); // Предотвращаем поведение по умолчанию
    
    setIsOpen(false);
    if (size === 'unset') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(size).run();
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие
    e.preventDefault(); // Предотвращаем поведение по умолчанию
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие
    setIsOpen(false);
  };

  return (
    <div 
      className="tiptap-fontsize-dropdown"
      onClick={(e) => e.stopPropagation()} // Запрещаем всплытие на самом контейнере
    >
      <button
        onClick={handleTriggerClick}
        className="font-size-trigger"
        aria-label="Размер шрифта"
        aria-expanded={isOpen}
        title="Размер шрифта"
      >
        <span className="text-xs font-mono">
          {currentSize === 'unset' ? 'Размер' : currentSize.replace('px', '')}
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
            onClick={(e) => e.stopPropagation()} // Запрещаем всплытие в меню
          >
            <div className="tiptap-fontsize-header">
              Размер шрифта
            </div>
            
            {FONT_SIZES.map((size) => {
              const isActive = size.value === 'unset' 
                ? !editor.getAttributes('textStyle').fontSize 
                : currentSize === size.value;
              
              return (
                <button
                  key={size.value}
                  onClick={(e) => handleSizeChange(size.value, e)}
                  className={`tiptap-fontsize-option ${isActive ? 'active' : ''}`}
                  style={
                    size.value !== 'unset' 
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