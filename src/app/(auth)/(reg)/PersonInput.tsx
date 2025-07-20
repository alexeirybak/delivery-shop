import { ChangeEvent } from "react";
import { formStyles } from "./styles";

interface PersonInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export default function PersonInput({
  id,
  label,
  value,
  onChange,
  type = "text",
}: PersonInputProps) {
  return (
    <div>
      <label htmlFor={id} className={formStyles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={formStyles.input}
      />
    </div>
  );
} 
 