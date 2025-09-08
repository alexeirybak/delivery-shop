import { ChangeEvent } from "react";
import { formStyles } from "../../../styles";

interface PersonInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PersonInput = ({ id, label, value, onChange }: PersonInputProps) => {
  return (
    <div>
      <label htmlFor={id} className={formStyles.label}>
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        className={formStyles.input}
      />
    </div>
  );
};

export default PersonInput;
