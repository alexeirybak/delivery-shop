import { useRef, useEffect } from "react";
import { TextAreaProps } from "../types";

export const TextArea = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
}: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={3}
      disabled={disabled}
    />
  );
};
